'use strict'

const { mongoose, Schema, Types } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'apikey'
const COLLECTION_NAME = 'apikeys'
// Declare the Schema of the Mongo model
var apikeySchema = new mongoose.Schema({
    key: {
        type:String,
        required:true,
        unique:true,
    },
    status: {
        type: Boolean,
        default: true
    },
    permissions:{
        type: [String],
        required:true,
        enum: ['0000', '1111', '2222']
    },

},{
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, apikeySchema);