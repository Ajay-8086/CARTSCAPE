const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2');
const coupon = new mongoose.Schema({
    couponCode:{type:String},
    couponName:{type:String},
    discount:{type:Number},
    purchaseAbove:{type:Number},
    purchaseminimum:Number,
    validFrom:{type:String},
    validTo:{type:String}
})
coupon.plugin(mongoosePaginate);
coupon.index({ validTo: 1 });
const couponModel = mongoose.model('coupon',coupon)
module.exports = couponModel