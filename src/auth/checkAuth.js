'use strict'

const { findById } = require('../services/apiKey.service')

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}

const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString()
        if(!key){
            return res.status(403).json({
                message: 'forbinddsen error'
            })
        }

        const objKey = await findById( key )

        if(!objKey){
            return res.status(403).json({
                message: 'forbinddsen error'
            })
        }
        req.objKey = objKey
        return next()


        
    } catch (error) {
        
    }
}
// check perimssion
const permission = ( permission ) => {
    return (req, res, next) => {
        console.log('check::::       ', req.objKey.permissions)
        if(!req.objKey.permissions){
            return res.status(403).json({
                message: 'permission denied'
            })
        }

        const validPermission = req.objKey.permissions.includes(permission)
        if(!validPermission){
            return res.status(403).json({
                message: 'permission denied'
            })
        }
        return next()
    }
}

const asyncHandler = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next)
    }
}
module.exports = {
    apiKey,
    permission,
    asyncHandler
}