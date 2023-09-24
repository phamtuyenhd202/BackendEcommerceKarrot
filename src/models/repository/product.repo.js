'use strict'

const {product, electronic, clothing, furniture } = require('../product.model')
const { Types } = require('mongoose')
const { getSelectData, unGetSelectData } = require('../../utils/index')

//find all list drafts product
const findALLDraftsForShop = async ({ query, limit, skip }) =>{
    return await queryProduct({ query, limit, skip })
}

//find all list pulished product
const findAllPublishedForShop = async ({ query, limit, skip }) =>{
    return await queryProduct({ query, limit, skip })
}
//search product
const searchProduct = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch)
    const results = await product
    .find({ isPublished: true, $text: { $search: regexSearch } }, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .lean()
  return results
}

//get all product
const findAllProduct = async ({limit, sort, page, filter, select}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1}
    return await product.find (filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()
}
//get product detail'
const findProductDetail = async ({ product_id, unSelect }) => {
    return await product.findById(product_id).select(unGetSelectData(unSelect))
  }

// update Product
const updateProductById = async ({
    product_id,
    bodyUpdate,
    model,
    isNew = true
}) => {
    return await model.findByIdAndUpdate(product_id, bodyUpdate, { new: isNew})
}

// publish product
const publishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })

    if(!foundShop) return null

    foundShop.isDraft = false
    foundShop.isPublished = true
    const { modifiedCount } = await foundShop.updateOne( foundShop )

    return modifiedCount
}

// unPublish product
const unPublishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    

    if(!foundShop) return null

    foundShop.isDraft = true
    foundShop.isPublished = false
    const { modifiedCount } = await foundShop.updateOne( foundShop )

    return modifiedCount

}



const queryProduct = async ({ query, limit, skip }) =>{
    return await product.find( query )
    .populate('product_shop', 'name email -_id')
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()
}

module.exports ={
    findALLDraftsForShop,
    findAllPublishedForShop,
    publishProductByShop,
    unPublishProductByShop,
    searchProduct,
    findAllProduct,
    findProductDetail,
    updateProductById,
}