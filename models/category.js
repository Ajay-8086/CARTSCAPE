const mongoose = require('mongoose')
const category = new mongoose.Schema({
    categoryName:{type:String,required:true,unique:true},
    categoryimage:{type:String},
    subCategory:{type:Array,unique:true}
}) 

const categoryModel = mongoose.model('category',category)

module.exports = categoryModel