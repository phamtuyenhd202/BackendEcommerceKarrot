'use strict'

const {Schema, model, mongoose} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'key'
const COLLECTION_NAME = 'keys'

// Declare the Schema of the Mongo model
var keyTokenSchema = new mongoose.Schema({
    user:{
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'shop'   
    },
    privateKey:{
        type: String,
        required: true,
    },
    publicKey:{
        type: String,
        required: true,
    },
    refreshTokensUsed: {
        type: Array, default: []
    },
    refreshToken: {
        type: String,
        required: true
    }
},{
    collection: COLLECTION_NAME,
    timestamps: true

});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, keyTokenSchema);
