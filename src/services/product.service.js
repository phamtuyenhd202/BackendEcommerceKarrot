'use strict'

const { BadRequestError } = require('../core/error.response')
const { product, clothing, electronic, furniture  } = require('../models/product.model')
const {removeUndefinedObject, updateNestedObjectParser } = require('../utils/index')
const { findALLDraftsForShop, 
    publishProductByShop, 
    unPublishProductByShop, 
    findAllPublishedForShop, 
    searchProduct,
    findAllProduct,
    findProductDetail,
    updateProductById,

} = require('../models/repository/product.repo')
const { insertInventory } = require('../models/repository/inventory.repo')

class ProductFactory {
    static productRegitstry = {}
    
    static registerProductType(type, classRef){
        ProductFactory.productRegitstry[type] = classRef

    }

    static async createProduct(type, payload){
        const productClass = ProductFactory.productRegitstry[type]
        if(!productClass) throw new BadRequestError(`Invalid product type ${type}`)

        return new productClass(payload).createProduct()
    }

    static async updateProduct(type, product_id, payload){
        const productClass = ProductFactory.productRegitstry[type]
        if(!productClass) throw new BadRequestError(`Invalid product type ${type}`)

        return new productClass(payload).updateProduct(product_id)
    }
    //PUT
    // publish product
    static async publishProductByShop({ product_shop, product_id }){
        return await publishProductByShop({ product_shop, product_id })
    }

    // unpublish product
    static async unPublishProductByShop({ product_shop, product_id }){
        return await unPublishProductByShop({ product_shop, product_id })
    }

    //END PUT


    //QUERY
    // get list drafts for shop
    static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true }
        return await findALLDraftsForShop({ query, limit, skip })
    }

    static async findAllPublishedForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublished: true }
        return await findAllPublishedForShop({ query, limit, skip })
    }

    //search product
    static async searchProduct ({ keySearch }) {
        return await searchProduct({ keySearch })
    }

    static async findAllProduct({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true } }){
        return await findAllProduct({ limit, sort, page, filter, 
            select: ['product_name', 'product_price', 'product_thumb', 'product_ratingsAverage']
        })
    }

    //find product detail
    static async findProductDetail({ product_id }) {
        return await findProductDetail({ product_id, unSelect: ['__v'] })
      }
    //END QUERY

}

// define base product

class Product {
    constructor({
        product_name, product_thumb, product_description,product_price,
        product_quantity, product_type, product_shop, product_attributes,
    }){
        this.product_name = product_name,
        this.product_thumb = product_thumb,
        this.product_description = product_description,
        this.product_price = product_price,
        this.product_quantity = product_quantity,
        this.product_type = product_type,
        this.product_shop = product_shop,
        this.product_attributes = product_attributes
    }

    //create product
    async createProduct( product_id ){
        const newProduct = await product.create({...this, _id: product_id })
        if(newProduct){
            await insertInventory({
                productId: newProduct._id,
                shopId: this.product_shop,
                stock: this.product_quantity
            })
        }

        return newProduct
    }

    // update product
    async updateProduct(product_id, bodyUpdate){
        return await updateProductById({product_id, bodyUpdate, model: product})
    }
}

class Clothing extends Product {
    async createProduct(){
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newClothing) BadRequestError('Create new clothing error')

        const newProduct = super.createProduct(newClothing._id)
        if(!newProduct) BadRequestError('Create new product error')
        return newProduct
    }

    async updateProduct( product_id ){

        //1. remove attr has null, undefined
        const objectParams = removeUndefinedObject(this)
        //2. xem update o cho nao
        if(objectParams.product_attributes){
            //update child
            await updateProductById({
                product_id, 
                body_Update: updateNestedObjectParser(objectParams.product_attributes), 
                model: clothing})
        }

        const updateProduct = await super.updateProduct(product_id, updateNestedObjectParser(objectParams))
        return updateProduct
    }
    
}

class Electronic extends Product {
    async createProduct(){
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newElectronic) BadRequestError('Create new newElectronic error')

        const newProduct = super.createProduct(newElectronic._id)
        if(!newProduct) BadRequestError('Create new product error')

        return newProduct
    }

    async updateProduct( product_id ){

        //1. remove attr has null, undefined
        const objectParams = removeUndefinedObject(this)
        //2. xem update o cho nao
        if(objectParams.product_attributes){
            //update child
            await updateProductById({
                product_id, 
                body_Update: updateNestedObjectParser(objectParams.product_attributes), 
                model: electronic})
        }

        const updateProduct = await super.updateProduct(product_id, updateNestedObjectParser(objectParams))
        return updateProduct
    }
    
}

class Furniture extends Product {
    async createProduct(){
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newFurniture) BadRequestError('Create new Furniture error')

        const newProduct = super.createProduct(newFurniture._id)
        if(!newProduct) BadRequestError('Create new product error')

        return newProduct
    }

    async updateProduct( product_id ){

        //1. remove attr has null, undefined
        const objectParams = removeUndefinedObject(this)
        //2. xem update o cho nao
        if(objectParams.product_attributes){
            //update child
            await updateProductById({
                product_id, 
                body_Update: updateNestedObjectParser(objectParams.product_attributes), 
                model: furniture})
        }

        const updateProduct = await super.updateProduct(product_id, updateNestedObjectParser(objectParams))
        return updateProduct
    }
}

//regitster product type
ProductFactory.registerProductType('Electronic', Electronic)
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Furniture', Furniture)

module.exports = ProductFactory