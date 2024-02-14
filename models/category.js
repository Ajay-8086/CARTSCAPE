const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2');
const category = new mongoose.Schema({
    categoryName:{type:String,required:true,unique:true},
    categoryimage:{type:String},
    subCategory:{type:Array,unique:true},
    isDeleted:{type:Boolean,default:false}
}) 
category.plugin(mongoosePaginate);
const categoryModel = mongoose.model('category',category)

module.exports = categoryModel