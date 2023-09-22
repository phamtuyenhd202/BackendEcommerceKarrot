
'use strict'

const ProductService = require("../services/product.service")


const { SuccessResponse } = require('../core/success.response')


class ProductController{

    //create product
    createProduct = async (req, res, next) => {  
        new SuccessResponse ({
            message: 'Create new product success!!',
            metadata: await ProductService.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
         }).send(res)
    }

    //publish product
    publishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update publish product success!!',
            metadata: await ProductService.publishProductByShop({ 
                product_shop: req.user.userId,  
                product_id: req.params.id
            })
        }).send(res)
    }

    //unPublish product
    unPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update unPublish product success!!',
            metadata: await ProductService.unPublishProductByShop({ 
                product_shop: req.user.userId,  
                product_id: req.params.id
            })
        }).send(res)
    }

    //QUERY
    /**
     * 
     * @desc Get all Drafts for shop 
     * @param {Number} limit 
     * @param {Number} skip 
     * @return { JSON }  
     */
    getAllDraftsForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list draft success!!',
            metadata: await ProductService.findAllDraftsForShop({ product_shop: req.user.userId })
        }).send(res) 
    }


    getAllPublishedForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list publish success!!',
            metadata: await ProductService.findAllPublishedForShop({ product_shop: req.user.userId })
        }).send(res) 
    }
    // get List Search Product
    getListSearchProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list search product success!!',
            metadata: await ProductService.searchProduct(req.params)
        }).send(res) 
    }

    //get all product when access website
    getAllProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get all list product success!!',
            metadata: await ProductService.findAllProduct(req.query)
        }).send(res) 
    }

    // get info detail product
    getProductDetail = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get info deail product success!!',
            metadata: await ProductService.findProductDetail({product_id: req.params.product_id})
        }).send(res) 
    }

}

module.exports = new ProductController()