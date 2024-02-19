const mongoose = require('mongoose')
const whishlist = new mongoose.Schema({
    productId:[{type:mongoose.Types.ObjectId,ref:'products'}],
    userId:{type:mongoose.Types.ObjectId}
})
const wishlisttModel = mongoose.model('whishlist',whishlist)
module.exports = wishlisttModel 