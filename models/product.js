const mongoosePaginate = require('mongoose-paginate-v2');
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
    productAdded:{type:String},
    category:{type:String},
    subcategory:{type:String}

})
product.plugin(mongoosePaginate);

const productModel = mongoose.model('products',product)

module.exports = productModel