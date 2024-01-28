var mongoose = require('mongoose');
var customer = new mongoose.Schema({
  user_name: {
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
  mobileNumber: {
    type: Number,
    required: true
  },
  role: {
    type: Boolean,
    default:false
  }
});

const customerModel = mongoose.model('customer',customer)

module.exports = customerModel
