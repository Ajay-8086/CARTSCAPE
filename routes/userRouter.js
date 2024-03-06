const express = require('express')
const router = express.Router()
const authController = require('../controller/authController')
const userController = require('../controller/userController')
const wislistController = require('../controller/wishlistController')
const cartController = require('../controller/cartController')
const productController = require('../controller/productController')
const orderController = require('../controller/orderController')

// USER MANAGEMENT =========================================================================================>

router.get('/',userController.home)
router.get('/profile',userController.getUserProfile)
router.get('/editprofile',userController.editProfileGet)
router.post('/editprofile',userController.editProfilePost)
router.get('/add-address',userController.getAddAddress)
router.post('/add-address',userController.postAddAddress)
router.delete('/address/delete',userController.deleteAddress)
router.get('/logout',userController.userLogout)

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

// USER PRODUCT MANAGEMENT ==================================================================================>
router.get('/allproducts',userController.getAllProducts)
router.get('/search',userController.searchProduct)
router.get('/checkout/add-address',orderController.checkoutAddress)
router.get('/checkout',orderController.getCheckout)
router.post('/checkout',orderController.postCheckout)
router.post('/checkout/add-address',orderController.postcheckoutAddress)
router.post('/make-purchase',orderController.makePurchase)
router.post('/verify-coupon',orderController.couponApply)
router.get('/payment',orderController.getPayment)
router.post('/addreview',userController.addReview)

// WHISHLISTMANAGEMENT ========================================================================================>
router.get('/wishlistcount',wislistController.getWishListCount)
router.post('/addtoWhislist',wislistController.addOrRemoveWhishlist)
router.get('/wishlist',wislistController.getWishList)
router.delete('/wishlist_remove',wislistController.deleteWishListed)
 
//CART MANAGEMENT============================================================================================>
router.get('/view_cart',cartController.getCart)
router.get('/cartcount',cartController.getCartCount)
router.post('/addtocart',cartController.addToCart)
router.patch('/cart_quanatity',cartController.cartQuantityManging)
router.delete('/remove_cart',cartController.cartItemRemove)

//PRODUCT MANAGEMENT===============================================================================================>
router.get('/products_page',productController.getProductPage)

// ORDER MANAGEMENT================================================================================================>
router.get('/cod-otp',orderController.getCashonDelivery)
router.post('/cod-otp',orderController.postCashonDelivery)
router.get('/my-orders',orderController.myOrders)
router.get('/cancel-order',orderController.cancelOrder)
router.get('/order-details',orderController.orderDetails)
router.post('/confirm-payment',orderController.paymentConfirmation)
module.exports = router