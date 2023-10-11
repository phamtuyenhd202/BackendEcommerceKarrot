
'use strict'



const { CREATED ,SuccessResponse } = require('../core/success.response')
const CartService = require('../services/cart.service')


class CartController{

    //create cart
    addToCart = async (req, res, next) => {  
        new CREATED ({
            message: 'Create new cart success!!',
            metadata: await CartService.addToCart( req.body )
         }).send(res)
    }
    //update cart
    updateToCart = async (req, res, next) => {  
        new SuccessResponse ({
            message: 'Update cart success!!',
            metadata: await CartService.addToCartV2( req.body )
         }).send(res)
    }
    //delete product in cart
    DeleteToCart = async (req, res, next) => {  
        new SuccessResponse ({
            message: 'delete cart success!!',
            metadata: await CartService.deleteUserCartItem( req.body )
         }).send(res)
    }
    //get list cart
    getListToCart = async (req, res, next) => {  
        new SuccessResponse ({
            message: ' get list cart success!!',
            metadata: await CartService.getListUsercart( req.query )
         }).send(res)
    }


}

module.exports = new CartController()