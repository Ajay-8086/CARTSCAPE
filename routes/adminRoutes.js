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
    postAddCategory


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
      .get('/admin/users/:userId',deleteUser)
      .get('/admin/category',getCategoryList)
      .get('/admin/addcategory',getAddCategory)
      .post('/admin/addcategory',postAddCategory)
    




module.exports= router