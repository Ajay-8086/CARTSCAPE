// const mongoose = require('mongoose');
// const customerModel = require('../models/customer')


module.exports={

    home:(req,res)=>{
        res.render('user/userDashboard')
    },

    getLogin:(req,res)=>{
        res.render('user/login')
    },

    getSignup:(req,res)=>{
        res.render('user/signup')
    },
    postSignup:(req,res)=>{
        
    },
    getCart:(req,res)=>{
        res.render('user/cart')
    },
    getWishList:(req,res)=>{
        res.render('user/wishlist')
    }
}