const categoryModel = require('../models/category')
const orderModel =  require('../models/order')
const productModel = require('../models/product')
const cartModel = require('../models/cart')
const { default: mongoose } = require('mongoose')
const profileModel = require('../models/profile')
const crypto = require('crypto')
module.exports = {
  getPayment:async(req,res)=>{
    try {
      const categories = await categoryModel.find({isDeleted:false})
      res.status(200).render('user/payment',{categories})
    } catch (error) {
      console.log(error);
      res.status(500).send('internal server error')
    }
  },
  getCashonDelivery:async(req,res)=>{
    try {
      const categories = await categoryModel.find({isDeleted:false})
      res.status(200).render('user/checkoutOtp',{categories})
    } catch (error) {
      console.log('internal server error');
      res.status(500).send('Internal server error')
    }
  },
  postCashonDelivery:async(req,res)=>{
      try {
        const email = req.session.checkoutEmail
        const products = req.session.productsDetails
        const totalPrice = req.session.totalPrice
        const userId = req.session.userId
        const addressId = new mongoose.Types.ObjectId(req.session.addressId)
        if(!email){
          res.status(401).json('User not found')
        }
        const { digit1, digit2, digit3, digit4 } = req.body;
        const userOtp = parseInt(`${digit1}${digit2}${digit3}${digit4}`);
            const generateOTP = req.session.checkoutOTP;
            if (generateOTP === userOtp) {
              const order = new orderModel({
                userEmail: email,
                products: products.map(product => ({
                    id: product.id,
                    quantity: product.quantity,
                    price:product.price,
                    selectedColor: product.selectedColor,
                    selectedSize: product.selectedSize
                })),
                
                address:addressId,
                totalPrice: totalPrice,
                paymentMethod: 'Cash on Delivery',
                status:'pending'
            });
          const result=   await order.save();
              if(result){
                for(const product of products){
                 await productModel.updateOne(
              {_id:product.id},
              {$set:{$inc:{stock:-product.quantity}}
              
            })
             await cartModel.updateOne(
              { userId },
              { $pull: { productId: { id: product.id} } }
          );
                }
             await orderModel.findByIdAndUpdate(result._id, { status: 'completed' });
                res.status(200).json('success')
              }

          } else {
              res.status(401).json('Invalid otp');
          }
    } catch (error) {
        res.status(500).json('internal server error')
    }
    },
    myOrders:async(req,res)=>{
      try {
        const categories = await categoryModel.find({isDeleted:false})
        const email= req.session.signedEmail
        const myOrders = await orderModel.find({userEmail:email}).populate('products.id')
        res.status(200).render('user/myOrders',{categories,myOrders})
      } catch (error) {
        console.log(error);
        res.status(500).send('internal sever error')
      }
    },
    cancelOrder:async(req,res)=>{
      try {
        const orderId = req.query.id
        const updatedOrder = await orderModel.findByIdAndUpdate(orderId,{status:'cancelled'})
        if(updatedOrder){
          res.status(200).redirect('/my-orders')
        }
      } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error')
      }
    },
    orderDetails:async(req,res)=>{
      try {
        const userId = req.session.userId
        if(!userId){
          return res.status(401).redirect('/login')
        }
        const categories = await categoryModel.find({isDeleted:false})
        const orderId = req.query.id
        const orderDetails = await orderModel.findById(orderId).populate('products.id')
        const addressId = orderDetails.address
        const userAddress = await profileModel.findOne({userId,})
        const orderAddress = userAddress.addresses.find(addr=>addr._id.toString()==addressId) 
        res.status(200).render('user/orderDetails',{categories,orderDetails,orderAddress})
      } catch (error) {
        console.log(error);
        res.status(500).send('internal server error')
      }
    },
    paymentConfirmation:async(req,res)=>{
      try {
        const {data} = req.body
        let generated_signature = crypto.createHmac('sha256',process.env.KEY_SECRET)
        generated_signature.update(data.razorpay_order_id + '|' + data.razorpay_payment_id)
        generated_signature = generated_signature.digest('hex')
       if (generated_signature == data.razorpay_signature) {
        const email = req.session.checkoutEmail
        const products = req.session.productsDetails
        const totalPrice = req.session.totalPrice
        const userId = req.session.userId
        const addressId = new mongoose.Types.ObjectId(req.session.addressId)
        const order = new orderModel({
          userEmail: email,
          products: products.map(product => ({
              id: product.id,
              quantity: product.quantity,
              price:product.price,
              selectedColor: product.selectedColor,
              selectedSize: product.selectedSize
          })),
          
          address:addressId,
          totalPrice: totalPrice,
          paymentMethod: 'Online Payment',
          status:'pending'
      });
    const result=   await order.save();
        if(result){
          for(const product of products){
           await productModel.updateOne(
        {_id:product.id},
        {$set:{$inc:{stock:-product.quantity}}
        
      })
       await cartModel.updateOne(
        { userId },
        { $pull: { productId: { id: product.id} } }
    );
          }
       await orderModel.findByIdAndUpdate(result._id, { status: 'completed' });
          res.status(200).json({payment:true})
        }
    
      }else{
        res.status(400).json({payment:false})
      }
      } catch (error) {
        console.log(error);
        res.status(500).json('internal server error')
      }
    },
  }
  

