'use strict'
const { update } = require("lodash")
const { BadRequestError, NotFoundError } = require("../core/error.response")
const { cart } = require("../models/cart.model")
const { findObjectById } = require("../utils")
const { getProductById } = require("../models/repository/product.repo")

/*
    feature cart service:
    1. add product to cart [Uset]
    2. reduce product quantity [User]
    3. increase product quantity [User]
    4. get list to cart [User]
    5. delete cart [User]
    6. delete Cart item [User] 
*/

class CartService {

    //// SATRT REPO CART ////
    static async createUserCart({ userId, product }){
        const query = {cart_userId: userId, cart_state: 'active'},
        updateOrInsert = {
            $addToSet: {
                cart_products: product,
            }
        },
        options = {upsert: true, new: true}

        return await cart.findOneAndUpdate(query, updateOrInsert, options)
    }

    static async updateUserCart({ userId, product }){
        const {productId, quantity} = product
        const query = {
            cart_userId: userId,
            'cart_products.productId': productId,
            cart_state: 'active'
        },
        update = {
            $inc: {
                'cart_products.$.quantity': quantity,
            }
        },
        options = {upsert: true, new: true}

        return await cart.findOneAndUpdate(query, update, options)
    }

    //// END REPO CART ////

    static async addToCart({userId, product = {}}){
        //check  car co ton tai hay khong
        const userCart = await cart.findOne({cart_userId: userId})

        if(!userCart){
            //create cart for user
            return await CartService.createUserCart({userId, product})
        }

        //neu co gio hang roi nhung chua co san pham?
        if(!findObjectById(userCart.cart_products, product.productId)){
            userCart.cart_products = [...userCart.cart_products, product]
            return userCart.save()
        }
        
        //neu gio hang ton tai va khi them product vao gio hang mà 
        //trùng product trong gio hang ta update quantity

        return await CartService.updateUserCart({userId, product})
    }

    //update cart
    /*
        shop_order_ids:[
            {
                shopId,
                item_products:[
                    {
                        quantity,
                        price,
                        shopId,
                        old_quantity,
                        productId
                    }
                ],
                version
            }
        ]

    */

    static async addToCartV2 ({userId, shop_order_ids}){
        const {productId, quantity, old_quantity} = shop_order_ids[0]?.item_products[0]
        console.log('{productId, quantity, old_quantity}:: ', {productId, quantity, old_quantity})
        const foundProduct = await getProductById(productId)
        console.log('foundProduct.product_shop::::', foundProduct)

        if(!foundProduct) throw new NotFoundError('Product does not exist')

        console.log('foundProduct.product_shop::::', foundProduct.product_shop)
        console.log('foundProduct.product_shop::::', shop_order_ids[0]?.shopId)

        //compre
        if(foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId){
            throw new NotFoundError('Product do not belong to the shop')
        }

        if(quantity === 0){
            //delete product
            await CartService.deleteUserCartItem({userId, productId})
            return await CartService.getListUsercart({userId})
        }

        return CartService.updateUserCart({
            userId,
            product:{
                productId,
                quantity: quantity - old_quantity
            }
        })
    }

    static async deleteUserCartItem({ userId, productId }){
        const query = {cart_userId: userId, cart_state: 'active'},
            updateSet = {
                $pull: {
                    cart_products: {
                        productId
                    }
                }
            }
        const deleteCart = await cart.updateOne(query, updateSet)
        return deleteCart
    }

    static async getListUsercart({ userId }){
        return await cart.findOne({cart_userId: userId}).lean()
    }

}


module.exports = CartService