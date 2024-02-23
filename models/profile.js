const mongoose = require('mongoose')
const profile = new mongoose.Schema({
    userId:{type:mongoose.Types.ObjectId,ref:'customers'},
    addresses:[{
        address:String,
        city:String,
        house_No:String,
        postcode:String,
        altr_number:String,
        country:String,
        district:String,
        _id:false
    }]
})
const profileModel = mongoose.model('profile',profile)
module.exports = profileModel