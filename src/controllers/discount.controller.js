
'use strict'



const { CREATED ,SuccessResponse } = require('../core/success.response')
const DiscountService = require('../services/discount.service')


class DiscountController{

    //create discount
    createDiscountCode = async (req, res, next) => {  
        new CREATED ({
            message: 'Create new discount success!!',
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId
            })
         }).send(res)
    }

    //get all  discount code by shop
    getAllDiscountCode = async (req, res, next) => {  
        new SuccessResponse ({
            message: 'get all discount by shop success!!',
            metadata: await DiscountService.getAllDiscountCodeByShop({
                ...req.query,
                shopId: req.user.userId
            })
         }).send(res)
    }

    //get discount amount
    getDiscountAmount = async (req, res, next) => {  
        new SuccessResponse ({
            message: 'get discount amount success!!',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body
            })
         }).send(res)
    }

    //get all  discount code by shop
    getAllDiscountCodeWithProducts = async (req, res, next) => {  
        new SuccessResponse ({
            message: 'get product by discount code success!!',
            metadata: await DiscountService.getAllDiscountCodesWithProduct({
                ...req.query,
            })
         }).send(res)
    }


    //get all  discount code by shop
    getAllDiscountCode = async (req, res, next) => {  
        new SuccessResponse ({
            message: 'Create new discount success!!',
            metadata: await DiscountService.getAllDiscountCodeByShop({
                ...req.query
            })
         }).send(res)
    }

    //update a discount code
    updateDiscountCode = async (req, res, next) => {  
        console.log('req.params.discount_id::::::::::: ', req.params.discount_id)
        new SuccessResponse ({
            message: 'Update discount success!!',
            metadata: await DiscountService.updateDiscountCode(req.params.discount_id, {...req.body })
         }).send(res)
    }

}

module.exports = new DiscountController()