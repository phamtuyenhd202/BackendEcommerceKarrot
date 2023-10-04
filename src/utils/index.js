'use strict'

const _ = require('lodash')
const {Types} = require('mongoose')

const getInfoData = ({ object = {}, fileds = [] }) => {
    return _.pick(object, fileds)
}

// [a, b] => {a:1, b: 1}

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}

const unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 0]))
}

const convertToObjectIdMongodb = id => new Types.ObjectId(id)

const removeUndefinedObject = obj => {
    Object.keys(obj).forEach(k => {
        if(obj[k]===null)
        delete obj[k]
    })
    return obj
}

/*
    const a ={
        b:{
            c:1,
            d:1
        }
    }

    => db.colection.updateOne({
        'b.c': 1,
        'b.d': 1
    })
*/

const updateNestedObjectParser = obj => {
    const final = {}
    Object.keys(obj || {}).forEach(k => {
        if(typeof obj[k] === 'object' && !Array.isArray(obj[k])){
            const subObj = updateNestedObjectParser(obj[k])
            Object.keys(subObj).forEach(sk => {
                final[`${k}.${sk}`] = subObj[sk]
            })
        }else{
            final[k] = obj[k]
        }
    })
    console.log('[final]:::', final)

    return final
}


module.exports = {
    getInfoData,
    getSelectData,
    unGetSelectData,
    removeUndefinedObject,
    updateNestedObjectParser,
    convertToObjectIdMongodb,
    
}