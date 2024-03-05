var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
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
  },
  blocked: {
    type: Boolean,
    default:false
  }
},{timestamps: true});
customer.plugin(mongoosePaginate)
const customerModel = mongoose.model('customers',customer)

module.exports = customerModel
