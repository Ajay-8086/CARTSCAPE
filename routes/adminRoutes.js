const express = require('express')
const router = express.Router();
const{setUploadType,upload}=require('../middlewares/multer')


const{
    getSignup,
    postSignup,
    getLogin,
    postLogin,
    getAdminVerify,
    postAdminVerify,
    getDashboard,
    getAddProduct,
    postAddProduct,
    getProducts,
    deleteProduct,
    getUserList,
    deleteUser,
    getCategoryList,
    getAddCategory,
    postAddCategory,
    deleteCategory,
    getCoupons,
    getAddCoupon,
    postAddCoupon,
    getUpdateCoupon,
    postUpdateCoupon,
    deleteCoupon,
    getBanner,
    getAddBanner,
    postAddBanner,
    getUpdateBanner,
    postUpdateBanner,
    deleteBanner
    



}=require('../controller/admincontoller')

router.get('/admin/signup',getSignup)
      .post('/admin/signup',postSignup)
      .get('/admin/verify',getAdminVerify)
      .post('/admin/verify',postAdminVerify)
      .get('/admin/login',getLogin)
      .post('/admin/login',postLogin)
      .get('/admin/dashboard',getDashboard)
      .get('/admin/addproduct',getAddProduct)
      .post('/admin/addproduct',setUploadType('products'),upload.array('image[]',999),postAddProduct)
      .get('/admin/product',getProducts)
      .get('/admin/delete/:id',deleteProduct)
      .get('/admin/users',getUserList)
      .delete('/admin/users/:userId',deleteUser)
      .get('/admin/category',getCategoryList)
      .get('/admin/addcategory',getAddCategory)
      .post('/admin/addcategory',setUploadType('category'),upload.single('categoryimage'),postAddCategory)

      .delete('/admin/delete/:categoryId',deleteCategory)
      .get('/admin/coupons',getCoupons)
      .get('/admin/addcoupon',getAddCoupon)
      .post('/admin/addcoupon',postAddCoupon)
      .get('/admin/edit-coupon/:couponId',getUpdateCoupon)
      .post('/admin/edit-coupon/:couponId',postUpdateCoupon)
      .delete('/admin/delete-coupon/:couponId',deleteCoupon)
      .get('/admin/banners',getBanner)
      .get('/admin/addbanner',getAddBanner)
      .post('/admin/addbanner',setUploadType('banner'),upload.single('bannerImage'),postAddBanner)
      .get('/admin/edit-banner/:bannerId',getUpdateBanner)
      .post('/admin/edit-banner/:bannerId',setUploadType('banner'),upload.single('bannerImage'),postUpdateBanner)
      .delete('/admin/delete-banner/:bannerId',deleteBanner)
      





module.exports= router