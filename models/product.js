const mongoosePaginate = require('mongoose-paginate-v2');
const mongoose = require('mongoose')
const product = new mongoose.Schema({
    name: { type: String, unique: true, require },
    image: { type: Array, require },
    description: { type: String, require },
    price: { type: Number, require },
    stock: { type: Number, require },
    discount: { type: Number, require },
    colors: { type: Array, require },
    size: { type: Array, require },
    productAdded: { type: String, require },
    category: { type: String, require },
    subcategory: { type: String, require },
    returnPolicy: {
        type: Boolean,
        default:false
    },
    isDeleted:{type:Boolean,default:false}

})
product.plugin(mongoosePaginate);

const productModel = mongoose.model('products', product)

module.exports = productModel