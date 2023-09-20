'use strict'

const {product, electronic, clothing, furniture } = require('../product.model')
const { Types } = require('mongoose')

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
}