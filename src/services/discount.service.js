'use stric'

const { BadRequestError, NotFoundError } = require("../core/error.response")
const discountModel = require("../models/discount.model")
const { findAllDiscountCodeUnSelect, checkDiscountExists, findAllDiscountCodeSelect, updateDiscountCodeById } = require("../models/repository/discount.repo")
const { findAllProduct } = require("../models/repository/product.repo")
const { convertToObjectIdMongodb, removeUndefinedObject, updateNestedObjectParser } = require("../utils")

/*
    1. generator discount code [shop/admin]
    2. get discount amount [user]
    3. get all discount codes [User/ shop]
    4. verify discount code [User]
    5. Delete discount code [Shop/ admin]
    6. cancel discount code [User]
*/

class DiscountService{
    static async createDiscountCode(payload){
        const {
            code, start_date, end_date, is_active, shopId,
            min_order_value, product_ids, applies_to, name, description,
            type, value, user_used, max_uses, uses_count, max_used_per_user
        } = payload

        if(new Date() > new Date(start_date) || new Date() > new Date(end_date)){
            throw new BadRequestError('Discount code has expried!')
        }

        if(new Date(start_date) > new Date(end_date)){
            throw new BadRequestError('Start date must be before end date has expried!')
        }

        //create for discount code
        const foundDiscount = await checkDiscountExists({
            model: discountModel,
            filter: {
                discount_code: code,
                discount_shopId: convertToObjectIdMongodb(shopId)
            }
        })  

        if(foundDiscount && foundDiscount.discount_is_active){
            throw new BadRequestError(' Discount exists!')
        }

        const newDiscount = await discountModel.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_code: code,
            discount_value: value,
            discount_min_order_value: min_order_value,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses: max_uses,
            discount_uses_count: uses_count,
            discount_user_used: user_used,
            discount_shopId: shopId,
            discount_max_uses_per_user: max_used_per_user,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === 'all' ? [] : product_ids
        })

        return newDiscount
    }

    //update discount
    static async updateDiscountCode(discount_id, bodyUpdate){
        const objectParams = removeUndefinedObject(bodyUpdate)

        // return await updateDiscountCodeById({_id: discount_id, objectParams, model: discountModel})
        const updateDicount = await updateDiscountCodeById({_id: discount_id, bodyUpdate: objectParams, model: discountModel})

        return updateDicount
    }

    static async getAllDiscountCodesWithProduct({
        code, shopId, limit, page
    }){

        const foundDiscount = await checkDiscountExists({
            model: discountModel,
            filter: {
                discount_code: code,
                discount_shopId: convertToObjectIdMongodb(shopId)
            }
        })
            

        console.log('founddi:::', foundDiscount)

        if(!foundDiscount || !foundDiscount.discount_is_active){
            throw new BadRequestError('Discount not exists!')
        }

        const {discount_applies_to, discount_product_ids} = foundDiscount
        let products
        if(discount_applies_to === 'all'){
            //get all product
            console.log('alll::::', foundDiscount)
            products = await findAllProduct({
                filter:{
                    product_shop: convertToObjectIdMongodb(shopId),
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']

            })
        }

        if(discount_applies_to === 'specific'){
            //get all product_ids
            products = await findAllProduct({
                filter: {
                    _id: {$in: discount_product_ids},
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }
        return products
    }

    static async getAllDiscountCodeByShop({
        limit, page, shopId
    }){
        const discounts = await findAllDiscountCodeSelect({
            filter: {
                discount_shopId: convertToObjectIdMongodb(shopId),
                discount_is_active: true
            },
            limit: +limit,
            page: +page,
            select: ['discount_code', 'discount_name'],
            model: discountModel

        })

        return discounts
    }

    //applly Discount code

    static async getDiscountAmount({code, userId, shopId, products}){

        console.log("code:::: shopId:::", code, shopId)
        const foundDiscount = await checkDiscountExists({
            model: discountModel,
            filter: {
                discount_code: code,
                discount_shopId: convertToObjectIdMongodb(shopId)
            }
        })
            

        console.log('founddi:::', foundDiscount)

       if(!foundDiscount) throw new NotFoundError(`discount dosen't exists`)

       const { 
        discount_is_active, 
        discount_max_uses, 
        discount_min_order_value,
        discount_start_date,
        discount_end_date,
        discount_users_used,
        discount_max_uses_per_user,
        discount_type,
        discount_value,

            } = foundDiscount
       
       if(!discount_is_active) throw new NotFoundError('discount expried!')
       if(!discount_max_uses) throw new NotFoundError('discount ara out!')

        if(new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)){
            throw new NotFoundError('Discount code has expried!')
       }

       //check xem co gia tri toi thieu hay khong
       let totalOrder = 0
        if(discount_min_order_value > 0){
            totalOrder = products.reduce((acc, product ) => {
                return acc + (product.quantity * product.price)
            }, 0)
            
            if(totalOrder < discount_min_order_value){
                throw new NotFoundError(`discount requires a minium order value of ${discount_min_order_value} `)
            }
       }

        if(discount_max_uses_per_user > 0 ){
            // const useUserDiscount = discount_users_used.find(userId => userId === userId)
            const useUserDiscount = discount_users_used.reduce((count, id) => {
                if(id === userId)
                    return count + 1
                return count
            }, 0)
            if(useUserDiscount > discount_max_uses_per_user)
                throw new BadRequestError('Additional discounts cannot be used')
            console.log( 'discount_users_used::::::::::::::',useUserDiscount)
        }

        //check xem discount nay la fixed_amount
        const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)
        console.log('discount_value', discount_value)

        
        
        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount
        }
    }

    // hàm delete có thể update version mới
    static async deleteDiscountCode({shopId, codeId}){
        //neu lamf thêm thì ta phải nghĩ đế trường hợp xem discount này có đang sử dụng ở đâu không nếu có thì không nên xoa
        // vi dụ luồng update
        // const foundDiscount = await discountModel.findOne({
        //     discount_code: codeId,
        //     discount_shopId: shopId,
        //     discount_is_active: true
        // })
        // if(!foundDiscount){}


        //TH đơn giản
        const deleted = await discountModel.findOneAndDelete({
            discount_code: codeId,
            discount_shopId: convertToObjectIdMongodb(shopId)
        })

        return deleted
    }
    

    //user cancel discount code
    static async cancelDicountCode({codeId, shopId, userId}){
        const foundDiscount = await checkDiscountExists({
            model: discountModel,
            filter:{
                discount_code: codeId,
                discount_shopId: convertToObjectIdMongodb(shopId)
            }
        })

        if(!foundDiscount) throw new NotFoundError('Discount code exists!')

        const result = await discountModel.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_user_used: userId,
            },
            $inc: {
                discount_max_uses: 1,
                discount_uses_count: -1
            }
        })

        return result
    }


}

module.exports = DiscountService