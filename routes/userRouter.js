const express = require('express')
const router = express.Router()
const authController = require('../controller/authController')
const userController = require('../controller/userController')
const wislistController = require('../controller/wishlistController')

// USER MANAGEMENT =========================================================================================>

router.get('/',userController.home)
router.get('/cart',userController.getCart)

// USER AUTHENTICATION MANAGEMENT===========================================================================>

router.get('/signup',authController.getSignup)
router.get('/login',authController.getLogin)
router.get('/verify-otp',authController.getOtp)
router.get('/forget/password',authController.getForgotPassword)
router.get('/forget/otp/verify',authController.getForgetOtp)
router.get('/change_password',authController.getChangePassword)
router.post('/login',authController.postLogin)
router.post('/change_password',authController.postChangePassword)
router.get('/resend_otpchange',authController.resendOtp)
router.post('/forget/otp/verify',authController.postForgetOtp)
router.post('/forget/password',authController.postForgotPassword)
router.post('/signup',authController.postSignup)
router.post('/verify-otp',authController.postOtp)

router.get('/allproducts',userController.getAllProducts)


// WHISHLISTMANAGEMENT ========================================================================================>
router.post('/wishlistcount',wislistController.getWishListCount)
router.post('/addtoWhislist',wislistController.addOrRemoveWhishlist)
      
module.exports = router