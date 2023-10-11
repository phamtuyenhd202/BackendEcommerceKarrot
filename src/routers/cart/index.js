'use strict'
const express = require('express')
const router = express.Router()
const { asyncHandler } = require('../../auth/checkAuth')
const { authentication } = require('../../auth/authUtils')
const CartController = require('../../controllers/cart.controller')


//create cart
router.post('/', asyncHandler(CartController.addToCart))
//get List cart
router.get('/', asyncHandler(CartController.getListToCart))
//update DicountCode
router.post('/update', asyncHandler(CartController.updateToCart))
//get all discount by shop
router.delete('/', asyncHandler(CartController.DeleteToCart))



module.exports = router