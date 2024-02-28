const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userEmail: String,
    products: [{
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
        quantity: Number,
        price: Number,
        selectedColor: String,
        selectedSize: String
    }],
    address: { type: mongoose.Schema.Types.ObjectId, ref: 'profiles' },
    totalPrice: Number,
    paymentMethod: String,
    status:String,
}, { timestamps: true });

const OrderModel = mongoose.model('Order', orderSchema);

module.exports = OrderModel;
