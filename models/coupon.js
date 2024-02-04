const mongoose = require('mongoose')
const coupon = new mongoose.Schema({
    couponCode:{type:String},
    couponName:{type:String},
    discount:{type:Number},
    validFrom:{type:String},
    validTo:{type:String}
})

const couponModel = mongoose.model('coupon',coupon)
module.exports = couponModel