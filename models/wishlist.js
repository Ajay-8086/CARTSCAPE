const mongoose = require('mongoose')
const whishlist = new mongoose.Schema({
    productId:[{type:mongoose.Types.ObjectId,ref:'products'}],
    userId:{type:mongoose.Types.ObjectId}
})
const cartModel = mongoose.model('whishlist',whishlist)
module.exports = cartModel