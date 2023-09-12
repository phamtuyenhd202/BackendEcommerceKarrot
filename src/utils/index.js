'use strict'

const _ = require('lodash')

const getInfoData = ({ object = {}, fileds = [] }) => {
    return _.pick(object, fileds)
}

module.exports = {
    getInfoData
}