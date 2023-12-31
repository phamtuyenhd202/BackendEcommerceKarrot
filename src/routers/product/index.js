'use strict'
const express = require('express')
const router = express.Router()
const ProductController = require('../../controllers/product.controller')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication } = require('../../auth/authUtils')

//full text search
router.get('/search/:keySearch', asyncHandler(ProductController.getListSearchProduct))
router.get('/:product_id', asyncHandler(ProductController.getProductDetail))
router.get('', asyncHandler(ProductController.getAllProduct))


// middleware authentication
router.use(authentication)
//logout
router.post('', asyncHandler(ProductController.createProduct))
router.patch('/:product_id', asyncHandler(ProductController.updateProduct))
router.post('/publish/:id', asyncHandler(ProductController.publishProductByShop))
router.post('/unpublish/:id', asyncHandler(ProductController.unPublishProductByShop))

router.get('/drafts/all', asyncHandler(ProductController.getAllDraftsForShop))
router.get('/published/all', asyncHandler(ProductController.getAllPublishedForShop))




module.exports = router