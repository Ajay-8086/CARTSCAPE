const adminModel = require('../models/admin')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv');
dotenv.config();

module.exports={
    getSignup:(req,res)=>{  
        res.render('admin/signup')
    },
    postSignup:async(req,res)=>{
        try {
            
            const {phone,email,name,password} = req.body
        const hashPassword = await bcrypt.hash(password, 10);
        req.body.password= hashPassword
        const adminExist = await adminModel.findOne({email})
        if(adminExist){
             if(adminExist.verified){
                return res.status(200).redirect('/admin/login')
            }else{
                req.flash('error',{email})
                res.status(200).redirect('/admin/verify')
            }
        }else{
           const admin= await adminModel.create(req.body)
       
             req.flash('error',{email})
             res.status(200).redirect('/admin/verify')
        }
        
      } catch (error) {
        res.status(500).redirect('/error')
      }

    },
    getAdminVerify:(req,res)=>{
        const error = req.flash('error')
        
        res.render('admin/verify',{error:error[0]})
    },
    postAdminVerify:async(req,res)=>{
        const{key,email} = req.body
       
        const adminKey = process.env.ADMINKEY
       
        if(key == adminKey){
            const adminExist =  await adminModel.findOne({email})
            
            if(adminExist){
                await adminModel.findOneAndUpdate({email},{$set:{verified:true}})
                res.status(200).redirect('/admin/dashboard')
            }else{
                res.redirect('/admin/signup')
            }

        }else{
            req.flash('error',{ key: 'Incorrect key' })
            res.status(401).redirect('/admin/verify')
        }
    },
    getLogin:(req,res)=>{
        
        res.render('admin/login',{error:req.flash('error')})
    },
    postLogin:async(req,res)=>{
        const {email,password} = req.body
        const adminExist = await adminModel.findOne({email})

        if(adminExist){
            if(adminExist.verified){
                res.redirect('/admin/dashboard')
            }else{
                res.redirect('/admin/verify')
            }
        }else{
            req.flash('error','please register')
        }
    }

}