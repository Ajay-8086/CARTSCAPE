const categoryModel = require('../models/category')
const bannerModel = require('../models/banner')
const productModel = require('../models/product')
const userModel = require('../models/customer')
const profileModel = require('../models/profile')
const bcrypt = require('bcrypt')
const customerModel = require('../models/customer')
const cartModel = require('../models/cart')
const couponModel = require('../models/coupon')
const sendMail = require('../utility/sendMail');
const razorpay = require('razorpay');

var instance = new razorpay({ key_id: process.env.KEY_ID, key_secret: process.env.KEY_SECRET })

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
            const minPrice = parseInt( req.query.minPrice)|| null
            const maxPrice = parseInt( req.query.maxPrice)|| null
            let filter = { isDeleted:false };
            if (categoryName) {
                filter.category = categoryName;
            }
            if (minPrice !== null) {
                filter.price = { $gte: minPrice };
            }
            if (maxPrice !== null) {
                if (!filter.price) filter.price = {};
                filter.price.$lte = maxPrice;
            }
    
            const products = await productModel.find(filter).skip((page - 1) * limit).limit(limit);
            const total = await productModel.countDocuments(filter);
            const noPages = Math.ceil(total / limit);
            res.status(200).render('user/store', { categories, products, page, total, noPages, categoryName, wishlist });
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
    makePurchase:async(req,res)=>{
        try {
       let { totalAmount, discount,productId} = req.body;
       const userId = req.session.userId
       if(req.query.productId){
        productId = req.query.productId
        const productDetails = await productModel.findOne({_id:productId})
        req.session.productDetails = productDetails
        const discountPrice = parseInt(productDetails.price*productDetails.discount/100)
        totalAmount = (productDetails.price)-discountPrice
        discount =  parseInt(totalAmount * 5/100)
       }
       req.session.totalPrice = totalAmount;
       req.session.discount = discount;
       if(!userId){
       return res.status(400).redirect('/login')
       }
       if(productId){
          return res.status(200).redirect('/checkout')
       }else{
       return res.status(401).redirect('/')
       }
        } catch (error) {
            console.log(error);
           return res.status(500).send('Internal server error')
        }
    },
    getCheckout:async(req,res)=>{
        try {
            let {totalPrice,discount} =req.session

            const userId = req.session.userId
            if(!userId){
               return res.status(401).redirect('/login')
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
             const productDetails = req.session.productDetails
             
             const singleProduct = {
                userId:userId,
                productId:[{
                id:productDetails,
                quantity:1,
                }]
            }
             if(productDetails){
                products=singleProduct
                delete req.session.productDetails;
             }else{

                 products = await cartModel.findOne({userId}).populate('productId.id')
             }
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
    postCheckout:async(req,res)=>{
        try {
            const {payment,email,products,totalPrice,addressId} = req.body
            req.session.productsDetails = products
            req.session.addressId = addressId
            req.session.payment = payment
            req.session.totalPrice = parseInt(totalPrice)
            const key = process.env.KEY_ID
            if(payment == 'Online_Payment'){
                const amount = Number(req.session.totalPrice) * 100
                const orderOptions = {
                    amount: amount, 
                    currency: 'INR',
                    receipt: 'receipt_order_1',
                    payment_capture: 1 
                };
                const order = await instance.orders.create(orderOptions);
                req.session.checkoutEmail = email
                res.status(200).json({ online: true, order,key });
            }else{
                req.session.checkoutEmail = email
                const generateOTP = req.session.generateOTP || Math.floor(1000 + Math.random() * 9000);
                req.session.checkoutOTP = generateOTP;
                await sendMail(email, `${generateOTP}`);
                res.status(200).json({cod:true})
            }
        } catch (error) {
            console.log(error);
            res.status(500).json('internal server error')
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
