const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2');
const banner = new mongoose.Schema({
    bannerName:{type:String},
    bannerHeading:{type:String},
    bannerImage:{type:String},
    specialPrice:{type:String},
    validFrom:{type:Date},
    validTo:{type:Date}
})
banner.plugin(mongoosePaginate);
banner.index({ validTo: 1 }, { expireAfterSeconds: 0 });
const bannerModel = mongoose.model('banner',banner)
module.exports = bannerModel
