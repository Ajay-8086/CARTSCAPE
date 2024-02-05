const mongoose = require('mongoose')
const banner = new mongoose.Schema({
    bannerName:{type:String},
    bannerHeading:{type:String},
    bannerImage:{type:String},
    specialPrice:{type:String},
    validFrom:{type:String},
    validTo:{type:String}
})

const bannerModel = mongoose.model('banner',banner)
module.exports = bannerModel
