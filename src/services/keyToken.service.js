'use strict'
// function create keyToken vesion for level maxxxxxxxxxxxx

const keytokenModel = require("../models/keytoken.model")
const { Types } = require('mongoose')

class KeyTokenService{
    static createKeyToken = async ({ userId, privateKey, publicKey, refreshToken }) => {
        try {
            
            //level 0000
            // const tokens = await keytokenModel.create({
            //     user: userId,
            //     privateKey,
            //     publicKey
            // })

            // return tokens ? tokens.publicKey : null

            //level maxxxx
            const filter = { user: userId }
            const update = { publicKey, privateKey, refreshTokensUser: [], refreshToken }
            const options = { upsert: true, new: true }

            const tokens = await keytokenModel.findOneAndUpdate( filter, update, options )
            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
    }

    static findKeyTokenById = async userId =>{
        return await keytokenModel.findOne({ user: new Types.ObjectId(userId) }).lean()
    }

    static deleteKeyTokenById = async id => {
        return await keytokenModel.deleteOne({ _id: id})
    }
}

module.exports = KeyTokenService

