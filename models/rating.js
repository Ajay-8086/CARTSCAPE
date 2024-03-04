const mongoose = require('mongoose')
const ratings = new mongoose.Schema({
    productId:{type:mongoose.Types.ObjectId,ref:'products'},
    reviews:
    [{
    userId:{type:mongoose.Types.ObjectId,ref:'customers'},
    rating:Number,
    review:String
    }]
})
const ratingModel = mongoose.model('rating',ratings)
module.exports = ratingModel