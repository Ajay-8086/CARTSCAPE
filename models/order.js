const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const orderSchema = new mongoose.Schema({
    userEmail: String,
    products: [{
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
        quantity: Number,
        price: Number,
        selectedColor: String,
        selectedSize: String
    }],
    address: { type: mongoose.Schema.Types.ObjectId, ref:'profiles' },
    totalPrice: Number,
    paymentMethod: String,
    status:String,
}, { timestamps: true });

orderSchema.plugin(mongoosePaginate);

const OrderModel = mongoose.model('Order', orderSchema);

module.exports = OrderModel;
