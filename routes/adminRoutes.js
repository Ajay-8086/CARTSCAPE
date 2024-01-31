const express = require('express')
const router = express.Router();


const{
    getSignup,
    postSignup,
    getLogin,
    postLogin,
    getAdminVerify,
    postAdminVerify

}=require('../controller/admincontoller')

router.get('/admin/signup',getSignup)
      .post('/admin/signup',postSignup)
      .get('/admin/verify',getAdminVerify)
      .post('/admin/verify',postAdminVerify)
      .get('/admin/login',getLogin)
      .post('/admin/login',postLogin)




module.exports= router