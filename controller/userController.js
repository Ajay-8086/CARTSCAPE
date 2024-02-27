const categoryModel = require('../models/category')
const bannerModel = require('../models/banner')
const productModel = require('../models/product')
const userModel = require('../models/customer')
const profileModel = require('../models/profile')
const bcrypt = require('bcrypt')
const customerModel = require('../models/customer')
const cartModel = require('../models/cart')
const couponModel = require('../models/coupon')
module.exports = {
    home: async(req, res) => {
        try {
            const categories = await categoryModel.find({isDeleted:false})
            const banners = await bannerModel.find({})
            const subcategory =req.query?.subcat
            const oneWeekAgo = new Date()
            oneWeekAgo.setDate(oneWeekAgo.getDate()-7)
            let products ;
            if(subcategory){
                products = await productModel.find({isDeleted:false,subcategory:subcategory,stock:{$gt:0}}).limit(8)
            }else{

                products = await productModel.find({createdAt:{$gte:oneWeekAgo},isDeleted:false,stock:{$gt:0}}).limit(8)
               if(!products || products.length==0){
                   products = await productModel.find({isDeleted:false,stock:{$gt:0}}).limit(8)
               }
            }
            res.status(200).render('user/userDashboard',{categories,banners,products,title:subcategory??'New Arrivals'})
        } catch (error) {
            res.status(500).send('Internal server error')
        }
    },
    getAllProducts:async(req,res)=>{ 
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 9;
            const userId = req?.session.userId
            const categories = await categoryModel.find({isDeleted:false})
            const wishlist = await cartModel.findOne({userId}).populate('productId')
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
            res.status(200).render('user/store',{categories,products,page,total,noPages,categoryName,wishlist})
        } catch (error) {
           console.log(error); 
        }
    },
    searchProduct:async(req,res)=>{
        try {
            const {query} = req.query
            const categories = await categoryModel.find({isDeleted:false})
            const products = await productModel.find({
                isDeleted: false,
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { category: { $regex: query, $options: 'i' } }
                ]
            });
            
         res.status(200).render('user/store',{categories,products})
        } catch (error) {
           res.status(500).send('Internal server error') 
        }
    },
    getUserProfile:async(req,res)=>{
       try {
        const categories = await categoryModel.find({isDeleted:false})
        const userId = req.session.userId
        const addressDetails = await profileModel.findOne({userId})
        const address= addressDetails?.addresses
        if(userId){
            const userDetails = await userModel.findOne({_id:userId})
            res.status(200).render('user/userProfile',{categories,userDetails,address})
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
    },
    getAddAddress:async(req,res)=>{
        try {
            const categories = await categoryModel.find({isDeleted:false})
            res.status(200).render('user/addAddress',{categories})
        } catch (error) {
            console.log(error);
            res.send('Internal server error')
        }
    },
    postAddAddress:async(req,res)=>{
        try {
           const {address,city,house_No,postcode,altr_number,state,country,district} = req.body
           const userId = req.session.userId
           if(!userId){
            res.status(401).redirect('/login')
           }else{
            const addressExist =await profileModel.findOne({userId})
            if(!addressExist){
                const newAdress =  new profileModel({userId,addresses:[{address,city,house_No,postcode,altr_number,state,country,district}]})
                await newAdress.save()
                res.status(200).json('address added successfully')
            }else{
                addressExist.addresses.push({address,city,house_No,postcode,altr_number,state,country,district})
                addressExist.save()
                res.status(200).json('address added successfully')
            }
           }
        } catch (error) {
            res.status(500).json('Internal server error')
        }
    },
    deleteAddress:async(req,res)=>{
        try {
            const userId = req.session?.userId
            const addressId = req.query.addressId
            const addressExist = await profileModel.findOne({userId})
            if(addressExist){
                const deleteAddress = await profileModel.updateOne(
                    { userId },
                    { $pull: { addresses: { _id: addressId } } }
                );
                if(deleteAddress){
                    res.status(200).json('deleted address')
                }else{
                    res.status(401).json('can not delete address')
                }
            }
        } catch (error) {
            res.status(500).json('Internal server error')
        }
    },
    makePurchase:(req,res)=>{
        try {
       const { totalAmount, discount, productId, quantity } = req.body;
       req.session.totalPrice = totalAmount;
       req.session.discount = discount;
       req.session.productId = productId;
       req.session.quantity = quantity;
       res.status(200).redirect('/checkout')
        } catch (error) {
            console.log(error);
            res.staus(500).send('Internal server error')
        }
    },
    getCheckout:async(req,res)=>{
        try {
            const {totalPrice,discount} =req.session

            const userId = req.session.userId
            if(!userId){
                res.status(401).redirect('/login')
            }else{
            const categories = await categoryModel.find({isDeleted:false})
            let users;
             usersAddressExist = await profileModel.findOne({userId})
             if(usersAddressExist){
                 users = await profileModel.findOne({userId}).populate('userId')
             }else{
                users = await customerModel.findOne({_id:userId})
             }
             let products;
             products = await cartModel.findOne({userId}).populate('productId.id')
             const applicableCoupons = await couponModel.find({ 
                $and: [
                    { purchaseAbove: { $gte: totalPrice } }, 
                    { purchaseminimum: { $lte: totalPrice } }
                ]
            });
            res.status(200).render('user/checkout',{categories,users,totalPrice,discount,products,applicableCoupons})
            }
        } catch (error) {
            res.status(500).send('Internal server error')
        }
    },
    couponApply:async(req,res)=>{
        try {
            const {coupon} = req.body
            const couponDetail = await couponModel.findOne({couponCode:coupon})
            const discount = couponDetail.discount
            res.status(200).json({discount:discount})
        } catch (error) {
            console.log(error);
            res.staus(500).json('internal server error')
        }

    },
    checkoutAddress:async(req,res)=>{
        try {
            const categories = await categoryModel.find({isDeleted:false})
            res.status(200).render('user/checkout-address',{categories})
        } catch (error) {
            console.log(error);
            res.send('Internal server error')
        }
    },
    postcheckoutAddress:async(req,res)=>{
        try {
           const {address,city,house_No,postcode,altr_number,state,country,district} = req.body
           const userId = req.session.userId
           if(!userId){
            res.status(401).json('invalid user')
           }else{
            const addressExist =await profileModel.findOne({userId})
            if(!addressExist){
                const newAdress =  new profileModel({userId,addresses:[{address,city,house_No,postcode,altr_number,state,country,district}]})
                await newAdress.save()
                res.status(200).json('address added success fully')
            }else{
                addressExist.addresses.push({address,city,house_No,postcode,altr_number,state,country,district})
                addressExist.save()
                res.status(200).json('address added success fully')
            }
           }
        } catch (error) {
            res.status(500).json('Internal server error')
        }
    },
    userLogout:(req,res)=>{
        try {
            req.session.destroy((err)=>{
                if(err){
                    console.log(err);
                    res.status(500).send('Internal server error')
                }else{
                    res.status(200).redirect('/')
                }
            })
        } catch (error) {
            res.status(500).send('Internal server error')
        }
    }
};
