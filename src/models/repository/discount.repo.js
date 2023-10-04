'use stric'

const { unGetSelectData, getSelectData } = require("../../utils")

const findAllDiscountCodeUnSelect = async ({
    limit = 50, page=1, sort= 'ctime', filter, unSelect, model
}) => {
    const skip = (page - 1) * limit
    const bySort = sort === 'ctime' ? {_id: -1} : {_id: 1}

    const documents = await model.find(filter)
    .sort(bySort)
    .skip(skip)
    .limit(limit)
    .select(unGetSelectData(unSelect))
    .lean()

    return documents
}

const findAllDiscountCodeSelect = async ({
    limit = 50, page=1, sort= 'ctime', filter, select, model
}) => {
    const skip = (page - 1) * limit
    const bySort = sort === 'ctime' ? {_id: -1} : {_id: 1}

    const documents = await model.find(filter)
    .sort(bySort)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()

    return documents
}

const checkDiscountExists = async ({model, filter}) =>{
    return await model.findOne(filter).lean()
}


const updateDiscountCodeById = async ({
    _id= discount_id,
    bodyUpdate,
    model,
    isNew = true
}) => {
    return await model.findByIdAndUpdate(_id, bodyUpdate, {new: isNew})
}

module.exports = {
    findAllDiscountCodeSelect,
    findAllDiscountCodeUnSelect,
    checkDiscountExists, 
    updateDiscountCodeById,   
}