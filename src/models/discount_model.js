'use strict'

const { Schema, model } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'Discounts'
// Declare the Schema of the Mongo model
var discountSchema = new Schema({
   discount_name: {type: String, required: true},
   discount_description: { type: String, required: true},
   discount_type: {type: String, default: 'fix_amount'}, //percentage(giam gia thoa phan tram)  
   discount_value: {type: Number, required: true}, //fix_amount => 10000vnd or precentage => 10%
   discount_code: {type: String, required: true}, //code discount
   discount_start_date: {type: Date, required: true}, //ngay bat dau giam gia
   discount_end_date: {type: Date, required: true}, //ngay ket thuc giam gia
   discount_max_uses: {type: Number, required: true}, //sl discount dc ap dung
   discount_uses_count: {type: Number, required: true}, //so discount da sd
   discount_users_used: {type: Array, default: []}, //ai da sd
   discount_max_use_per_user: {type: Number, required: true}, //sl cho phep to da su dung discount moi user
   discount_min_oder_value: {type: Number, required: true}, //gai tri toi thieu dc ap du discount
   discount_shopId: {type: Schema.Types.ObjectId, ref: 'Shop'}, 

   discount_is_active: {type: Boolean, default: true},
   discount_applies_to: {type: Array, required: [], enum: ['all', 'specific']},
   discount_product_ids: {type: Array, default: []} // so sp duoc ap dung

},{
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, discountSchema);