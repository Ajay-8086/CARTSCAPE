const categoryModel = require('../models/category')
const cartModel = require('../models/cart')
const mongoose = require('mongoose')
module.exports={
    getCart:async(req,res)=>{
        try {   
                 const userId = req.session.userId
                 console.log(userId);
                const categories = await categoryModel.find({isDeleted:false})
                const cartItems = await cartModel.findOne({userId}).populate('productId.id')
                console.log(cartItems);
                res.status(200).render('user/cart',{categories,cartItems})
        
        } catch (error) {     
            console.log('error',error);
        }
    },
    getCartCount:async(req,res)=>{
        try {
            const userId = req.session.userId
            if(!userId){
                return res.status(401).json({ error: 'Unauthorized', message: 'User is not logged in' });
            }else{
                const cart =await cartModel.findOne({userId})
                const count = cart.productId.length
                res.status(200).json({isLogged:true,count,cart})
            }
        } catch (error) {
            res.status(500).json('Internal server error')
        }
        
    },
    addToCart:async(req,res)=>{
        try {
            const userId = req.session.userId
            if(!userId){
                return res.status(401).json({ error: 'Unauthorized', message: 'User is not logged in' });
            }else{
                const productId = req.body.id
                console.log('id',productId);
                const id = new mongoose.Types.ObjectId(productId)
                console.log(id);
                const cart = await cartModel.findOne({userId})
                if(!cart){
                    const newCart = new cartModel({userId,productId:[{id,quantity:1}]})
                  await  newCart.save()
                    res.status(200).json({success:true,count:1})
                }else{
                    const productExist = cart.productId.find(item=>item.id==productId)
                    console.log(productExist);
                    if(productExist){
                       return res.status(200).json()
                    }else{
                    cart.productId.push({id,quantity:1})
                   await cart.save()
                   const cartDetails = await cartModel.findOne({userId})
                   const count = cartDetails.productId.length
                   res.status(200).json({success:true,count})
                }
                }
            }
        } catch (error) {
            console.error(error);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    }
}