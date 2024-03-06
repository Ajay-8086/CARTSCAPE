const express = require('express')
const router = express.Router();
const productController = require('../controller/productController')
const couponController = require('../controller/couponController')
const bannerController = require('../controller/bannerController')
const categoryController = require('../controller/categoryController')
const authController = require('../controller/authController')
const{setUploadType,upload}=require('../utility/multer')
const adminController=require('../controller/admincontoller')
const chartController = require('../controller/chartController')

//AUTHENTICATIONS===============================================================================================>

        router.get('/signup',authController.getSignup)
        router.post('/signup',authController.postSignup)
        router.get('/verify',authController.getAdminVerify)
        router.post('/verify',authController.postAdminVerify)
        router.get('/login',authController.getLogin)
        router.post('/login',authController.postLogin)
        router.get('/logout',authController.adminLogout)

// PRODUCT ROUTES=============================================================================================>

      router.get('/addproduct',productController.getAddProduct)
      router.post('/addproduct',setUploadType('products'),upload.array('image',999),productController.postAddProduct)
      router.get('/product',productController.getProducts)
      router.delete('/delete/:id',productController.deleteProduct)
      router.get('/edit-product/:productId',productController.getUpdateProduct)
      router.post('/edit-product/:productId',setUploadType('products'),upload.array('image',999),                 productController.postUpdateProduct)
      router.get('/singleproduct/:productId',productController.getSingleProduct)

//CATEGORY MANGEMENT =============================================================================================>

      router.get('/category',categoryController.getCategoryList)
      router.get('/addcategory',categoryController.getAddCategory)
      router.post('/addcategory',setUploadType('category'),upload.single('categoryimage'),categoryController.postAddCategory)
      router.delete('/delete-category/:categoryId',categoryController.deleteCategory)
      router.get('/edit-category/:categoryId',categoryController.getUpdateCategory)
      router.patch('/edit-category/:categoryId',setUploadType('category'),upload.single('categoryImage'),categoryController.postUpdateCategory)
      router.delete('/subcategory',categoryController.subCategoryDelete)

//ADMIN USERMANGEMENT=============================================================================================>

      router.get('/users',adminController.getUserList)
      router.patch('/users/:userId',adminController.blockUser)
      router.get('/blocked-users',adminController.getBlockedUsers)
      router.patch('/users-unblock/:userId',adminController.unBlockUser)
      router.get('/orders',adminController.getUserOrders)
      router.delete('/userOrder-cancel',adminController.userOrderCancel)
//BANNER MANAGEMENT===============================================================================================>

      router.get('/banners',bannerController.getBanner)
      router.get('/addbanner',bannerController.getAddBanner)
      router.post('/addbanner',setUploadType('banner'),upload.single('bannerImage'),bannerController.postAddBanner)
      router.get('/edit-banner/:bannerId',bannerController.getUpdateBanner)
      router.post('/edit-banner/:bannerId',setUploadType('banner'),upload.single('bannerImage'),bannerController.postUpdateBanner)
      router.delete('/delete-banner/:bannerId',bannerController.deleteBanner)
      
//COUPON MANAGEMENT===============================================================================================>

      router.get('/coupons',couponController.getCoupons)
      router.get('/addcoupon',couponController.getAddCoupon)
      router.post('/addcoupon',couponController.postAddCoupon)
      router.get('/edit-coupon/:couponId',couponController.getUpdateCoupon)
      router.post('/edit-coupon/:couponId',couponController.postUpdateCoupon)
      router.delete('/delete-coupon/:couponId',couponController.deleteCoupon)

//GRAPH MANAGEMENT================================================================================================>
      router.get('/home',chartController.adminDahboardGet)
      router.get('/chart-category',chartController.categoryChart)
      router.get('/chart-order',chartController.orderChart)
      router.get('/chart-customers',chartController.customerGrowth)



module.exports= router