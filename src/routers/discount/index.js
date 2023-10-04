'use strict'
const express = require('express')
const router = express.Router()
const { asyncHandler } = require('../../auth/checkAuth')
const { authentication } = require('../../auth/authUtils')
const DiscountController = require('../../controllers/discount.controller')


//discount amount
router.post('/amount', asyncHandler(DiscountController.getDiscountAmount))
//get list product by a discount code
router.get('/list_product_code', asyncHandler(DiscountController.getAllDiscountCodeWithProducts))



// middleware authentication
router.use(authentication)

//create DicountCode
router.post('/create', asyncHandler(DiscountController.createDiscountCode))
//update DicountCode
router.patch('/update/:discount_id', asyncHandler(DiscountController.updateDiscountCode))
//get all discount by shop
router.get('/', asyncHandler(DiscountController.getAllDiscountCode))



module.exports = router