const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2');
const banner = new mongoose.Schema({
    bannerName:{type:String},
    bannerHeading:{type:String},
    bannerImage:{type:String},
    specialPrice:{type:String},
    validFrom:{type:String},
    validTo:{type:String}
})
banner.plugin(mongoosePaginate);
const bannerModel = mongoose.model('banner',banner)
module.exports = bannerModel
