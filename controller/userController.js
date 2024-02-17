const categoryModel = require('../models/category')
const bannerModel = require('../models/banner')
const productModel = require('../models/product')
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
            const categories = await categoryModel.find({isDeleted:false})
            const categoryName = req.query?.category
            let products;
            if(categoryName){
                products = await productModel.find({isDeleted:false,category:categoryName})
            }else{
                products = await productModel.find({isDeleted:false})
            }
            res.status(200).render('user/store',{categories,products})
        } catch (error) {
           console.log(error); 
        }
    },


    getCart: (req, res) => {
        try {
            res.status(200).render('user/cart')
        } catch (error) {
            res.status(500).send('Internal server error')
        }
    },

   
};
