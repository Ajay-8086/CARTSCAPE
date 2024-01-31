var mongoose = require('mongoose');
var customer = new mongoose.Schema({
  name: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  verified: {
    type: Boolean,
    default:false
  }
});

const customerModel = mongoose.model('customer',customer)

module.exports = customerModel
