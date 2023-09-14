
'use strict'

const AccessService = require("../services/access.service")

const shopModel = require('../models/shop.model')
const { CREATED, SuccessResponse } = require('../core/success.response')


class AccessController{

    //login
    handlerRefreshToken = async (req, res, next) => {  
        new SuccessResponse ({
            message: 'Get toKen success!!',
            metadata: await AccessService.handlerRefreshToken({
                keyStore: req.keyStore,
                user: req.user,
                refreshToken: req.refreshToken
            }),      
         }).send(res)
      

    }
    //login
    login = async (req, res, next) => {  
        new SuccessResponse ({ 
            metadata: await AccessService.login(req.body),      
         }).send(res)
      

    }

    //login
    logout = async (req, res, next) => {
        console.log('req.keyStore controller::::: ', req.keyStore)
        new SuccessResponse({
            message: 'Logout Success!',
            metadata: await AccessService.logout(req.keyStore),
        }).send(res)
    }

 //signUp   
    signUp = async (req, res, next) => {
        
        new CREATED({ 
            message: 'Registered OK!',
            metadata: await AccessService.signUp(req.body),
            options: {
                limit: 10 // exemple
            }
         }).send(res)
        // return res.status(201).json(await AccessService.signUp(req.body))

    }
}

module.exports = new AccessController()