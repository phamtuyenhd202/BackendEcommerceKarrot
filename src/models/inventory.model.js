'use strict'

const { Schema, Types, model } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'Inventories'
// Declare the Schema of the Mongo model
var InventorySchema = new Schema({
    inven_productId: {type: Types.ObjectId, ref: 'Product'},
    inven_shopId: {type: Types.ObjectId, ref: 'shop'},
    inven_stock: { type: Number, required: true},
    inven_location: {type: String, default: 'unKnow'},
    inven_reservations: {type: Array, default: []}

},{
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = {
    inventory: model(DOCUMENT_NAME, InventorySchema)
}