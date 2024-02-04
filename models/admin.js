const mongoose = require('mongoose');
const admin = new mongoose.Schema({
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

const adminModel = mongoose.model('admin',admin)

module.exports = adminModel
