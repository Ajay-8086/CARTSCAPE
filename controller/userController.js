const categoryModel = require('../models/category')
const bannerModel = require('../models/banner')
const productModel = require('../models/product')
module.exports = {
    home: async(req, res) => {
        try {
            const categories = await categoryModel.find({isDeleted:false,stock:{$gt:0}})
            const banners = await bannerModel.find({})
            const oneWeekAgo = new Date()
            oneWeekAgo.setDate(oneWeekAgo.getDate()-7)
            const products = await productModel.find({createdAt:{$gte:oneWeekAgo},isDeleted:false}).limit(8)
            res.status(200).render('user/userDashboard',{categories,banners,products})
        } catch (error) {
            res.status(500).send('Internal server error')
        }
    },


    getCart: (req, res) => {
        try {
            res.status(200).render('user/cart')
        } catch (error) {
            res.status(500).send('Internal server error')
        }
    },

    getWishList: (req, res) => res.render('user/wishlist')
};
