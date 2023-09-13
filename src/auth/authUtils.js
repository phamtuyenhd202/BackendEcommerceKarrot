'use strict'

const JWT = require('jsonwebtoken')
const { asyncHandler } = require('./checkAuth')
const { AuthFailureError, NotFoundError } = require('../core/error.response')
const KeyTokenService = require('../services/keyToken.service')

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization'
}

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = JWT.sign(payload, publicKey, {
            
            expiresIn: '2 days'
        })
        const refreshToken = JWT.sign(payload, privateKey, {

            expiresIn: '7 days'
        })
        JWT.verify(accessToken, publicKey, (err, decode) => {
            if(err){
                console.log('error verify:: ', err)
            }else{
                console.log('decode verify:: ', decode)
            }
            console.log('decode verify:: ', decode)

        })
        return {accessToken, refreshToken}

    } catch (error) {
        
    }
}

const authentication = asyncHandler( async (req, res, next) =>{
    //1. check userId missing qua HEADER
    //2. get accessToken 
    //3. verifyToken
    //4. check user in dbs
    //5. check keyStore with tis userId
    //6. OK all -> return next
    const userId = req.headers[HEADER.CLIENT_ID]
    if(!userId) throw new AuthFailureError('Invalid Request')

    const keyStore = await KeyTokenService.findKeyTokenById(userId)
    console.log('keyStore::1     ', keyStore)
    if(!keyStore) throw new NotFoundError('Not Found keyStore')

    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!accessToken) throw new AuthFailureError('Invalid Request')
    console.log('accessToken:::::: ', accessToken)

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if(userId !== decodeUser.userId) throw new AuthFailureError('Invalid UserId')

        req.keyStore = keyStore

        return next()

    } catch (error) {
        throw error
    }


} )

module.exports = {
    createTokenPair,
    authentication,
}