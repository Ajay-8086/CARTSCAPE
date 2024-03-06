const categoryModel = require('../models/category')
const cartModel = require('../models/cart')
const mongoose = require('mongoose')
module.exports={

    getCart:async(req,res)=>{
        try {   
                const userId = req.session.userId
               if(userId){
                const categories = await categoryModel.find({isDeleted:false})
                const cartItems = await cartModel.findOne({userId}).populate('productId.id')
                const totalCartPrice = cartItems?.productId.reduce((accumulator, element) => {
                    return accumulator + (parseInt((element.id.price-(element.id.price*element.id.discount/100))) * element.quantity);
                }, 0);
                res.status(200).render('user/cart',{categories,cartItems,totalCartPrice})
               }else{
                res.status(401).redirect('/login')
               }
        
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
                const id = new mongoose.Types.ObjectId(productId)
                const cart = await cartModel.findOne({userId})
                if(!cart){
                    const newCart = new cartModel({userId,productId:[{id,quantity:1}]})
                    await  newCart.save()
                    res.status(200).json({success:true,count:1})
                }else{
                    const productExist = cart.productId.find(item=>item.id==productId)
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
    },
    cartQuantityManging:async(req,res)=>{
       try {
           const userId = req.session.userId
           const productId = req.body.id
           const newProductId = new mongoose.Types.ObjectId(productId)
            const newQuantity = req.body.quantity 
            
            await cartModel.updateOne({userId:userId,"productId.id":newProductId},{$set:{"productId.$.quantity":newQuantity}})

            res.status(200).json({success:true})
       } catch (error) {
        console.log(error);
        res.status(500).json('Internal server error')
       }
    },

    cartItemRemove: async (req, res) => {
    try {
        const productId = req.query.id;
        const userId = req.session.userId;
        const id =new mongoose.Types.ObjectId(productId)
        const cart = await cartModel.updateOne(
            { userId },
            { $pull: { productId: { id:  id} } }
        );
        const cartDetails = await cartModel.findOne({userId})
        const count = cartDetails.productId.length 
        if(cart){
            res.status(200).json({message:'cart updated',count});
        }else{
            res.status(400).json('cart not updated');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

}