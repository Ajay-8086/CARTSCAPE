const mongoose = require('mongoose')
const product = new mongoose.Schema({
    name:{type:String, unique:true},
    image:{type:Array},
    description:{type:String},
    price:{type:Number},
    stock:{type:Number},
    discount:{type:Number},
    colors:{type:Array},
    size:{type:Array},
    productAdded:{type:String}

})

const productModel = mongoose.model('products',product)

module.exports = productModel