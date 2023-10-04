'use strict'

const { model, Schema } = require('mongoose'); // Erase if already required
const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'Discounts'
// Declare the Schema of the Mongo model
const discountSchema = new Schema({
    discount_name: { type: String, required: true},
    discount_description: {type: String, requires: true},
    discount_type: { type: String, default: 'fixed_amount'},  //percentage
    discount_value: {type: Number, required: true}, // fix-amount 10.000vnd or percentage 10%
    discount_code: {type: String, required: true}, //code discount
    discount_start_date: {type: Date, required: true}, // ngay bat dau
    discount_end_date: {type: Date, required: true}, //ngay ket thuc
    discount_max_uses: {type: Number, required: true}, // sl discount duoc ap dung
    discount_uses_count: {type: Number, required: true}, // so discount da sd
    discount_users_used: {type: Array, default: []}, // ai da sd
    discount_max_uses_per_user: {type: Number, required: true}, //sl cho phep to da duoc sd moi user
    discount_min_order_value: {type: Number, required: true}, //gia trị tối thiểu được giảm giá
    discount_shopId: {type: Schema.Types.ObjectId, ref: 'Shop'},

    discount_is_active: {type: Boolean, default: true},
    discount_applies_to: {type: String, required: true, enum: ['all', 'specific']},
    discount_product_ids: {type: Array, default: []} // so sp dc ap dung discount

},{
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, discountSchema);
        