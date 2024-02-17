const productModel = require('../models/product')
const userModel = require('../models/customer')
const wishlistModel = require('../models/wishlist')
const { default: mongoose } = require('mongoose')

module.exports={
    addOrRemoveWhishlist: async(req, res) =>{
        try {
            const userId = req.session.userId
            if(!userId){
              res.status(400).json({user:false}) 

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
                        res.status(200).json({success:true})
                    }else{
                        whishlist.productId.pull(id)
                        await whishlist.save()
                        res.status(200).json({success:false})
                    }
                }
            }
        } catch (error) {
            console.log('error');
            res.status(500).json('Internal server error')
        }
        
    } ,

        
}