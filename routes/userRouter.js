const express = require('express')
const router = express.Router()


const {
    home,
    getSignup,
    getLogin,
    postLogin,
    postSignup,
    getOtp,
    postOtp,
    getCart,
    getWishList,
    getForgotPassword,
    postForgotPassword,
    getForgetOtp,
    postForgetOtp,
    resendOtp,
    getChangePassword,
    postChangePassword
} = require('../controller/userController')

router.get('/',home)
      .get('/signup',getSignup)
      .get('/login',getLogin)
      .get('/cart',getCart)
      .get('/wishlist',getWishList)
      .get('/verify-otp',getOtp)
      .get('/forget/password',getForgotPassword)
      .get('/forget/otp/verify',getForgetOtp)
      .get('/change_password',getChangePassword)
      .post('/login',postLogin)
      .post('/change_password',postChangePassword)
      .get('/resend_otpchange',resendOtp)
      .post('/forget/otp/verify',postForgetOtp)
      .post('/forget/password',postForgotPassword)
      .post('/signup',postSignup)
      .post('/verify-otp',postOtp)
      
      
module.exports = router