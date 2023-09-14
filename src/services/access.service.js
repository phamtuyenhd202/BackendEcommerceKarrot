'use strict'
const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('node:crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair } = require("../auth/authUtils")
const { Console } = require("console")
const { getInfoData } = require("../utils")
const { BadRequestError, AuthFailureError, ForbiddenError } = require("../core/error.response")

const { findByEmail } = require("./shop.service")





const roleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITER: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {

    static handlerRefreshToken = async ({keyStore, user, refreshToken }) => {
        const { userId, email } = user
        // kiem tra refreshToken co trong refreshTokensUsed khoong
        if(keyStore.refreshTokensUsed.includes(refreshToken)) {
            //neu co del keytoken
            await KeyTokenService.deleteByUserId( userId )
            throw new ForbiddenError('Something wrng happen !! pls relogin')
        }

        //kiem tra refreshToken dang hop le vaf refreshToken truyen voa de xem co shop do trong db khong
        if( keyStore.refreshToken !== refreshToken ) throw new AuthFailureError('Shop not regitstered!!')

        const foundShop = await findByEmail({ email })
        if(!foundShop) throw new AuthFailureError('Shop not regitstered!!')
        // toa tokens
        const tokens = await createTokenPair({ userId, email}, keyStore.publicKey, keyStore.privateKey)
        //add refreshToken in refreshTokensUsed
        await keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken
            }
        })

        return {
            user: { userId, email },
            tokens
        }
    }
    
        /*
            1. check email
            2. match pass
            3. create AT vs RT  and save
            4. generate tokens
            5. get dat return login
        */
    static login = async ({ email, password}) => {
        //1. check email
        const foundShop = await findByEmail({ email })
        if(!foundShop) throw new BadRequestError('Shop not regitered')
        //2. match pass
        const match = await bcrypt.compare(password, foundShop.password)
        if(!match) throw new BadRequestError('Authentication error')

        // 3. create publicKet vs privateKey
        const  privateKey = crypto.randomBytes(64).toString('hex')
        const  publicKey = crypto.randomBytes(64).toString('hex')
        // 4. generate tokens
        const tokens = await createTokenPair({userId: foundShop._id, email}, publicKey, privateKey)
        
        await KeyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            publicKey, 
            privateKey,
            userId: foundShop._id
        })

        return {
            shop: getInfoData({ fileds: ['_id', 'name', 'email'], object: foundShop }),
            tokens
        }
    }

    //logout
    static logout = async (keyStore) => {
            const delKey = KeyTokenService.deleteKeyTokenById(keyStore._id)

            return delKey
    }   

    static  signUp = async ({ name, email, password }) => {
             //step 1: check email exists??
             console.log("1******************************")
             const hodelShop = await shopModel.findOne({ email })
             console.log("1")
          
             if(hodelShop){
                 throw new BadRequestError('Error: Shop already  regitered!')
             }
             
             
 
             const passwordHash = await bcrypt.hash(password, 10)
             const newShop = await shopModel.create({
                 name, email, password: passwordHash, roles: [roleShop.SHOP]
             })
         
             
             if(newShop){             
                 //create privateKey and publicKey
                 const  privateKey = crypto.randomBytes(64).toString('hex')
                 const  publicKey = crypto.randomBytes(64).toString('hex')
                  
                 console.log({ privateKey, publicKey }) // save collection keyStore
 
                 
         
                 const keyStore = await KeyTokenService.createKeyToken({
                     userId: newShop._id,
                     publicKey, 
                     privateKey,
                     
                 })
                    
                 if(!keyStore){
                     return {
                         code: 'xxx',
                         message: 'keyStore error'
                     }
                 }
 
                 // create token pair
                 const tokens = await createTokenPair({userId: newShop._id, email}, publicKey, privateKey)
                 console.log('Sreate Token Success', tokens)
 
     
                 return {
                     shop: getInfoData({ fileds: ['_id', 'name', 'email'], object: newShop }),
                     tokens
                 }
             }
 
             return {
                 code: 200,
                 metadata: null
                 
             }
    }
}
module.exports = AccessService

