const categoryModel = require('../models/category')
const bannerModel = require('../models/banner')
const productModel = require('../models/product')
const userModel = require('../models/customer')
const bcrypt = require('bcrypt')
module.exports = {
    home: async(req, res) => {
        try {
            const categories = await categoryModel.find({isDeleted:false})
            const banners = await bannerModel.find({})
            const oneWeekAgo = new Date()
            oneWeekAgo.setDate(oneWeekAgo.getDate()-7)
            const products = await productModel.find({createdAt:{$gte:oneWeekAgo},isDeleted:false,stock:{$gt:0}}).limit(8)
            res.status(200).render('user/userDashboard',{categories,banners,products})
        } catch (error) {
            res.status(500).send('Internal server error')
        }
    },
    getAllProducts:async(req,res)=>{ 
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 9;
            const categories = await categoryModel.find({isDeleted:false})
            const categoryName = req.query?.category
            let products;
            let total;
            if(categoryName){
                products = await productModel.find({isDeleted:false,category:categoryName}).skip((page - 1) * limit)
                .limit(limit);
                total=   await productModel.countDocuments({isDeleted:false,category:categoryName})
            }else{
                products = await productModel.find({isDeleted:false}).skip((page - 1) * limit)
                .limit(limit);
             total=   await productModel.countDocuments({isDeleted:false})
            }
            const noPages = Math.ceil(total / limit);
            res.status(200).render('user/store',{categories,products,page,total,noPages,categoryName})
        } catch (error) {
           console.log(error); 
        }
    },
    getUserProfile:async(req,res)=>{
       try {
        const categories = await categoryModel.find({isDeleted:false})
        const userId = req.session.userId
        if(userId){
            const userDetails = await userModel.findOne({_id:userId})
            res.status(200).render('user/userProfile',{categories,userDetails})
        }else{
            res.status(400).redirect('/login')
        }
       } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error')
       }

    },
    editProfileGet:async(req,res)=>{
       try {
        const categories = await categoryModel.find({isDeleted:false})
        const userId = req.session.userId
        if(userId){
            const userDetails = await userModel.findOne({_id:userId})
            res.status(200).render('user/editProfile',{categories,userDetails})
        }else{
            res.status(400).redirect('/login')
        }
       } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error')
       }
    },
    editProfilePost:async(req,res)=>{
       try {
        const userId = req.session.userId
        if(userId){
            const { name, email, phone, password } = req.body;
            let hashPassword;
            if(password){
                hashPassword = await bcrypt.hash(password, 10);
            }else{
                const oldPassword = await userModel.findById(userId)
                hashPassword=oldPassword.password
            }
         await userModel.findByIdAndUpdate(userId,{name,email,phone,password:hashPassword})
            res.status(200).json('userProfile updated successfully')
        }else{
            res.status(401).json('unauthorised user')
        }
       } catch (error) {
        console.log(error);
        res.status(500).json('Internal server error')
       }
    }
  
};
