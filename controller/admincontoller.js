const adminModel = require('../models/admin')
const productModel = require('../models/product')
const userModel = require('../models/customer') 
const categoryModel = require('../models/category')
const couponModel = require('../models/coupon')
const fs = require('fs')
const path = require('path')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv');
const moment = require('moment')

dotenv.config();

module.exports={

    // ADMIN SIGNUP MANAGEMENT ------------------------------------------------------------------------------->


    getSignup:(req,res)=>{  
        res.render('admin/signup')
    },
    postSignup:async(req,res)=>{
        try {
            
            const {phone,email,name,password} = req.body
        const hashPassword = await bcrypt.hash(password, 10);
        req.body.password= hashPassword
        const adminExist = await adminModel.findOne({email})
        if(adminExist){
             if(adminExist.verified){
                return res.status(200).redirect('/admin/login')
            }else{
                req.flash('error',{email})
                res.status(200).redirect('/admin/verify')
            }
        }else{
           const admin= await adminModel.create(req.body)
       
             req.flash('error',{email})
             res.status(200).redirect('/admin/verify')
        }
        
      } catch (error) {
        res.status(500).redirect('/error')
      }

    },
    getAdminVerify:(req,res)=>{
        const error = req.flash('error')
        
        res.render('admin/verify',{error:error[0]})
    },
    postAdminVerify:async(req,res)=>{
        try {
            const{key,email} = req.body
       
        const adminKey = process.env.ADMINKEY
       
        if(key == adminKey){
            const adminExist =  await adminModel.findOne({email})
            
            if(adminExist){
                await adminModel.findOneAndUpdate({email},{$set:{verified:true}})
                res.status(200).redirect('/admin/dashboard')
            }else{
                res.redirect('/admin/signup')
            }

        }else{
            req.flash('error',{ key: 'Incorrect key' })
            res.status(401).redirect('/admin/verify')
        }
        } catch (error) {
            res.status(500).json({error:'Internal server error'})
        }
    },
    getLogin:(req,res)=>{
        
        const errorMessages = req.flash('error');
        res.render('admin/addProduct', { error: errorMessages });
    },
    postLogin:async(req,res)=>{
        const {email,password} = req.body
        const adminExist = await adminModel.findOne({email})

        if(adminExist){
            if(adminExist.verified){
                const passwordVerify = await bcrypt.compare(password,(adminExist.password))
                if(passwordVerify)
                res.redirect('/admin/dashboard')
                else{
                    res.redirect('/admin/login')
                }
            }else{
                res.redirect('/admin/verify')
            }
        }else{
            req.flash('error','please register')
        }
    },
    getDashboard:(req,res)=>{
        res.render('admin/dashboard',{error:req.flash('error')})
    },

    // PRODUCT MANAGEMENT ----------------------------------------------------------------------->


    getProducts:async(req,res)=>{
        try {
            const products = await productModel.find({})
        res.render('admin/products',{products})
        } catch (error) {
            res.status(500).json({error:'Internal server error'})
        }
    },


    getAddProduct:async(req,res)=>{
        try {
            const  categoryList = await categoryModel.find({})
            res.render('admin/addProduct',{categoryList})
        } catch (error) {
            res.status(500).json({error:'Internal server error'})
        }
        
    },

    postAddProduct:async (req,res)=>{
        try {
            const {name,price,stock,discount,description,colors} =req.body
            // console.log(req.body);
            const productExist = await productModel.findOne({name})
            console.log(productExist);
            if (!req.files || req.files.length === 0) {
                
                return res.status(400).json({error:'No files uploaded'});
            }
            if(req.files.length>5){
                
                return res.status(400).json({error:'product images exceeded(>5)'})
            }
            if(productExist){
               

               return res.status(400).json({error:'Product already exist'})
            }
   
           const  image= req.files.map((file) => file.filename)
        const productAdded = moment().format('DD/MM/YYYY')
        const newProduct = await productModel({name,price,stock,discount,description,image,colors,productAdded })
        await newProduct.save()
        res.status(200).json({success:true})
        } catch (error) {
            res.status(500).json({error:'Internal server error'})
        }
        
    },
 
    

    deleteProduct:async(req,res)=>{
        try {
            const product_id = req.params.id
            await productModel.deleteOne({_id:product_id})
            res.status(200).redirect('/admin/product')
        } catch (error) {
            console.log('Error while deleting the product');
            res.status(500).send('intenal server error')
        }
    },

    // USER MANAGEMENT -------------------------------------------------------------------------->

    getUserList:async(req,res)=>{
        const users = await userModel.find({})
        res.render('admin/userList',{users})
    },
    deleteUser:async(req,res)=>{
       try {
       const userId = req.params.userId
       
       
       const deleted= await userModel.deleteOne({_id:userId})
       
       
       if(deleted){
           
           res.status(200).json({success:true,message:'user deleted successfully'})
        }
        else{
          res.status(400).json({error:'user not deleted'})
       }
       } catch (error) {
        console.log('Server error');
        res.status(500).json({error:'Internal server error'})
       }
    },
           

    // CATEGORY MANAGEMENT ------------------------------------------------------------------------>

    getCategoryList:async(req,res)=>{
        try {
           const categoryList = await categoryModel.find({})
        //    console.log(categoryList[0].subCategory[0]);
           res.render('admin/category',{categoryList})
        } catch (error) {
            console.log('server error');
            res.status(500).send('Internal server error')
        }
    },
    getAddCategory:(req,res)=>{
        res.render('admin/addCategory')
    },
    postAddCategory: async (req, res) => {
        try {
            const { subCategory, categoryName } = req.body;
            const abc = JSON.parse(subCategory)
            const categoryimage = req.file.filename
            const categoryExist = await categoryModel.findOne({ categoryName });
            if (categoryExist) {
                const subCategoryExist = subCategory.find(element => element === categoryExist.subCategory);
    
                if (subCategoryExist) {
                    return res.status(400).json({ error: 'Category already exists' });
                } else {
                    await categoryModel.updateOne({ categoryName }, { $push: { subCategory: { $each: subCategory } } });
                    res.status(200).json({ message: 'Subcategories added successfully' });
                }
            } else {
                await categoryModel.create({
                    categoryName,
                    categoryimage,
                    subCategory:abc
                });
                res.status(200).json({ message: 'Category created successfully' });
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    deleteCategory:async(req,res)=>{
        const categoryId = req.params.categoryId
        const existingCategory = await categoryModel.findOne({_id:categoryId})
        try {
            const oldImagePath = path.join(__dirname,'../public/uploads/category',existingCategory.categoryimage)
            fs.unlinkSync(oldImagePath)
            const deleted =  await categoryModel.deleteOne({_id:categoryId})
            if(deleted.deletedCount==0){
                res.status(400).json({message:'category not found'})
            }

            res.status(200).json({message:'category deleted successfully'})

        } catch (error) {
            console.log(error.message);
            res.status(500).json({error:'Internal server error'})
        }
    },
    

    // Coupon management ------------------------------------------------------------------------->

    getCoupons:async(req,res)=>{
       try {
        const coupons = await couponModel.find({})
        res.status(200).render('admin/coupons',{coupons})
       } catch (error) {
        console.log(error.message);
        res.status(500).json({error:'Internal server error'})
       }
    },
    getAddCoupon:(req,res)=>{
        res.status(200).render('admin/addCoupon')
    },
    postAddCoupon:async(req,res)=>{
        try {
            const {couponCode,couponName,discount,validFrom,validTo} = req.body
            const newCoupon = await couponModel(
            {couponCode,couponName,discount,validFrom,validTo} 
        )
        await newCoupon.save()
        res.status(200).redirect('/admin/dashboard')
        } catch (error) {
            console.log('error');
        }

    },
    getUpdateCoupon:async(req,res)=>{
        try {
            const id = req.params.couponId
        const coupon = await couponModel.find({_id:id})
        res.status(200).render('admin/updateCoupons',{coupon})
        } catch (error) {
            console.log(error.message);
            res.status(500).json({error:'Internal server error'})
        }
    },
    postUpdateCoupon:async(req,res)=>{
        try {
           
            const id = req.params.couponId
           
        const {couponCode,couponName,discount,validFrom,validTo} = req.body
        
        const updateCoupon = await couponModel.findByIdAndUpdate(id,{$set:{couponCode,couponName,discount,validFrom,validTo}})
        if(updateCoupon){
            res.status(200).json({msg:'coupon updated successfully'})
        }else{
            res.status(400).json({msg:'product updating failed'})
        }
        } catch (error) {
            res.status(500).json({msg:'internal server error'})
        }
    }


    
    
    
}