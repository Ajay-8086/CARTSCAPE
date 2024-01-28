const express = require('express')
const router = express.Router()


const {
    home,
    getSignup,
    getLogin,
    postSignup,
    getCart,
    getWishList
} = require('../controller/userController')

router.get('/',home)
      .get('/signup',getSignup)
      .get('/login',getLogin)
      .get('/cart',getCart)
      .get('/wishlist',getWishList)
      
module.exports = router