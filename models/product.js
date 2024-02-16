const mongoosePaginate = require('mongoose-paginate-v2');
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    image: { type: Array, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    discount: { type: Number},
    colors: { type: Array, required: true },
    size: { type: Array },
    productAdded: { type: String, required: true },
    category: { type: String, required: true },
    subcategory: { type: String, required: true },
    returnPolicy: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

productSchema.plugin(mongoosePaginate);

const Product = mongoose.model('products', productSchema);

module.exports = Product;
