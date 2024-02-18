const productModel = require('../models/product')
const userModel = require('../models/customer')
const categoryModel = require('../models/category')
const wishlistModel = require('../models/wishlist')
const mongoose  = require('mongoose')

module.exports={
    addOrRemoveWhishlist: async(req, res) =>{
        try {
            const userId = req.session.userId
            if(!userId){
                return res.status(401).json({ error: 'Unauthorized', message: 'User is not logged in' });
            }else{
                const product_Id= req.query.productId
                const id = new mongoose.Types.ObjectId(product_Id)
                const whishlist = await wishlistModel.findOne({userId})
                if(!whishlist){
                    const newWishlist = new wishlistModel({ userId: userId, productId: [id] }); 
                    await newWishlist.save();
                    res.status(200).json({ success: true });
                }else{
                    if(!whishlist.productId.includes(id)){
                        whishlist.productId.push(id)
                        await whishlist.save()
                         const wishListDetails =await wishlistModel.findOne({userId})
                    const count = wishListDetails.productId.length
                        res.status(200).json({success:true,count})
                    }else{
                        whishlist.productId.pull(id)
                        await whishlist.save()
                    const wishListDetails =await wishlistModel.findOne({userId})
                    const count = wishListDetails.productId.length
                        res.status(200).json({success:false,count})
                    }
                }
            }
        } catch (error) {
            console.log('error');
            res.status(500).json('Internal server error')
        }
        
    } ,
    getWishListCount:async(req,res)=>{
        try {
            const userId = req.session.userId
            if(!userId){
                return res.status(401).json({ error: 'Unauthorized', message: 'User is not logged in' });
            }else{
                const wishlist =await wishlistModel.findOne({userId})
                const count = wishlist.productId.length
                res.status(200).json({isLogged:true,count,wishlist})
            }
        } catch (error) {
            res.status(500).json('Internal server error')
        }
    },
        
    getWishList:async(req,res)=>{
        try {
            const userId = req.session.userId
            const categories = await categoryModel.find({isDeleted:false})
            const wishlistedItems = await wishlistModel.findOne({userId}).populate('productId')
            res.render('user/wishlist',{categories,wishlistedItems})
        } catch (error) {
            console.log(error);
        }
    },
    deleteWishListed:async(req,res)=>{
        try {
            const userId = req.session.userId
            const id = req.query.id
            const productId = new mongoose.Types.ObjectId(id)
            const wishlist = await wishlistModel.updateOne(
                { userId },
                { $pull: { productId: productId } } )
             if(wishlist){
                const wishListDetails =await wishlistModel.findOne({userId})
                const count = wishListDetails.productId.length
                res.status(200).json({message:'item removed',count})
            }
            else{
                res.status(400).json('unable to remove')
            }
        } catch (error) {
            console.log(error);
            res.status(500).json('Internal server error')
        }
    }
}