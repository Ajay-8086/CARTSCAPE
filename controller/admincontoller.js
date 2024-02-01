const adminModel = require('../models/admin')
const productModel = require('../models/product')
const userModel = require('../models/customer')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv');
const moment = require('moment')
dotenv.config();

module.exports={
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

    //product listing page
    getProducts:async(req,res)=>{
        const products = await productModel.find({})
        res.render('admin/products',{products})
    },


    getAddProduct:(req,res)=>{
        
        res.render('admin/addProduct')
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
 
    // deleting the product

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
    getUserList:async(req,res)=>{
        const users = await userModel.find({})
        res.render('admin/userList',{users})
    },
    deleteUser:async(req,res)=>{
       try {
        const userId = req.params.userId
        await userModel.deleteOne({_id:userId})
        res.status(200).redirect('/admin/users')
       } catch (error) {
        console.log('Server error');
        res.status(500).send('Internal server error')
       }
    }
    
    
    
}