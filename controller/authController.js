const adminModel = require('../models/admin')
const customerModel = require('../models/customer');
const categoryModel = require('../models/category')
const sendMail = require('../utility/sendMail');
const { sendVerificationCode, verifyOtp } = require('../utility/verification')
const bcrypt = require('bcrypt')
module.exports = {
    //ADMIN AUTHENTICATION MANAGEMENT===========================================================================>
    
    adminGetSignup: async(req, res) => {
        try {
            res.status(200).render('admin/signup')
        } catch (error) {
            res.status(500).send('Internal sseerver error')
        }
    },
    adminPostSignup: async (req, res) => {
        try {
            
            const { phone, email, name, password } = req.body
            const hashPassword = await bcrypt.hash(password, 10);
            req.body.password = hashPassword
            const adminExist = await adminModel.findOne({ email })
            if (adminExist) {
                if (adminExist.verified) {
                    return res.status(200).redirect('/admin/login')
                } else {
                    req.flash('error', { email })
                    res.status(200).redirect('/admin/verify')
                }
            } else {
                await adminModel.create({phone,email,name,password})

                req.flash('error', { email })
                res.status(200).redirect('/admin/verify')
            }
            

        } catch (error) {
            res.status(500).redirect('/error')
        }

    },
    getAdminVerify: (req, res) => {
        try {
            const error = req.flash('error')
            res.status(200).render('admin/verify', { error: error[0] })
        } catch (error) {
            res.status(500).send('Internal server error')
        }
    },
    postAdminVerify: async (req, res) => {
        try {
            const { key, email } = req.body
            
            const adminKey = process.env.ADMINKEY
            
            if (key == adminKey) {
                const adminExist = await adminModel.findOne({ email })
                
                if (adminExist) {
                    await adminModel.findOneAndUpdate({ email }, { $set: { verified: true } })
                    res.status(200).redirect('/admin/home')
                } else {
                    res.redirect('/admin/signup')
                }
                
            } else {
                req.flash('error', { key: 'Incorrect key' })
                res.status(401).redirect('/admin/verify')
            }
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' })
        }
    },
    adminLogin: (req, res) => {
        try {
            const errorMessages = req.flash('error');
            res.status(200).render('admin/login', { error: errorMessages });
        } catch (error) {
            res.status(500).send('Internal server error')
        }
    },
    adminPostLogin: async (req, res) => {
        const { email, password } = req.body
        const adminExist = await adminModel.findOne({ email })
        
        if (adminExist) {
            if (adminExist.verified) {
                const passwordVerify = await bcrypt.compare(password, (adminExist.password))
                if (passwordVerify){
                    req.session.adminLoggedIn = true
                    res.redirect('/admin/home')
                }
                else {
                    req.flash('error', 'password is not valid')
                    res.redirect('/admin/login')
                }
            } else {
                res.redirect('/admin/verify')
            }
        } else {
            req.flash('error', 'please register')
        }
    },
    getAdminForget:(req,res)=>{
        try {
            const error= req.flash('error')
            res.status(200).render('admin/adminForgetpassword',{error})
        } catch (error) {
            console.log(error);
            res.send('Internal server error')
        }
    },
    postAdminForget:async(req,res)=>{
        try {
            const {email} = req.body
            const adminExist = await adminModel.findOne({email})
            if (adminExist) {
                res.status(200).redirect('/admin/verify')
            }else{
                req.flash('error','Admin does not exist')
                res.status(400).redirect('/admin/forget-password')
            }
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal server error')
        }
    },
    adminLogout:(req,res)=>{
        try {
            req.session.destroy((err)=>{
                if(err){
                    console.log(err);
                    res.status(500).send('Internal server error')
                }else{
                    res.status(200).redirect('/')
                }
            })
        } catch (error) {
            res.status(500).send('Internal server error')
        }
    },
    
    //USER AUTHENTICATION MANAGEMENT===============================================================================>

    getLogin: async(req, res) => {
        try {
            const errorMessage = req.flash('error')[0];
            const categories = await categoryModel.find({isDeleted:false})
            res.status(200).render('user/login', { messages: { error: errorMessage } ,categories});
        } catch (error) {
            res.status(500).send('Internal server error')
        }
    },
    
    postLogin: async (req, res) => {
        try {
            const { email, password } = req.body;
            const userExist = await customerModel.findOne({ email });
            const phone = userExist.phone
            if (!userExist) {
                req.flash('error', 'User does not exist. Please register.');
                return res.status(400).redirect('/login');
            } else {
                const passwordCheck = await bcrypt.compare(password, userExist.password);
                if (passwordCheck) {
                    if (userExist.verified && !userExist.blocked) {
                        console.log('gsa');
                        req.session.userId = userExist._id
                        req.session.signedEmail = userExist.email
                        req.session.isLoggedIn = true
                        res.status(200).redirect('/')
                    } else if(!userExist.verified && !userExist.blocked) {
                        console.log('not verified');
                        req.flash('error', { phone })
                    res.status(200).redirect('/verify-otp');
                    await sendVerificationCode(phone);
                    }else{
                        console.log('user blocked');
                    }
                } else {
                    req.flash('error', 'Invalid password');
                    return res.status(401).redirect('/login');
                }
            }
        } catch (error) {
            console.log(error.message);
            res.status(500).redirect('/error')
        }
    },

    
    getSignup: async(req, res) => {
        try {
            res.status(200).render('user/signup')
        } catch (error) {
            res.status(500).send('Internal server error')
        }
    },
    
    postSignup: async (req, res) => {
        try {
            const { name, email, phone, password } = req.body.data;
            const hashPassword = await bcrypt.hash(password, 10);
            const userExist = await customerModel.findOne({ email });
            if (userExist) {
                if (userExist.verified) {
                    return res.status(400).json('User exist');
                } else {
                    await sendVerificationCode(phone);
                    res.status(200).json({phone});
                }
            } else { 
                const user = new customerModel({ name, email, phone, password: hashPassword });
                            await user.save();                      
               const saveData =  await sendVerificationCode(phone);
               if (saveData) {
                    res.status(200).json({phone});
                }
            }
        } catch (err) {
            console.error('Error sending verification code:', err);
            res.status(500).json({ error: 'Failed to send verification code.' });
        }
    },

    getOtp: async(req, res) => {
        try {
            const categories = await categoryModel.find({isDeleted:false})
            const phone = req.query.phone
            res.status(200).render('user/otpVerify',{categories,phone})
        } catch (error) {
            res.status(500).send('Internal server error')
        }
    },

    postOtp: async (req, res) => {
        try {
            const { digit1, digit2, digit3, digit4 } = req.body;
            const phone = req.query.phone
            await verifyOtp(res, phone, `${digit1}${digit2}${digit3}${digit4}`);
            res.redirect('/login');
        } catch (error) {
            res.status(500).send('internal server error')
        }
    },

    getForgotPassword: async(req, res) => {
        try {
            const categories = await categoryModel.find({isDeleted:false})
            res.status(200).render('user/forgetPassword',{categories})
        } catch (error) {
            res.status(500).send('Internal server error')
        }
    },
    
    postForgotPassword: async (req, res) => {
        try {
            const { email } = req.body;
            const userExist = await customerModel.findOne({ email });
            const generateOTP = req.session.generateOTP || Math.floor(1000 + Math.random() * 9000);
            req.session.generateOTP = generateOTP;
            req.session.otp_email = email;

            if (!userExist) {
                return res.status(400).send('User not found');
            }
            await sendMail(email, `${generateOTP}`);
            res.redirect('/forget/otp/verify');
        } catch (error) {
            console.error('Unexpected error:', error);
            res.status(500).send('Internal Server Error');
        }
    },
    
    getForgetOtp: async(req, res) =>{
        try {
            const categories = await categoryModel.find({isDeleted:false})
            res.render('user/forgotOtp',{categories})
            
        } catch (error) {
            console.error('Unexpected error:', error);
            res.status(500).send('Internal Server Error');
        }
    } ,

    resendOtp: async (req, res) => {
        try {
            const generateOTP = req.session.generateOTP || Math.floor(1000 + Math.random() * 9000);
            req.session.generateOTP = generateOTP;
            const email = req.session.otp_email;
            await sendMail(email, `${generateOTP}`);
            res.redirect('/forget/otp/verify');
        } catch (error) {
            res.atatus(500).send('Internal server error')
        }
    },
      
    postForgetOtp: (req, res) => {
        try {
            const { digit1, digit2, digit3, digit4 } = req.body;
            const userOtp = parseInt(`${digit1}${digit2}${digit3}${digit4}`);
            const generateOTP = req.session.generateOTP;
            if (generateOTP === userOtp) {
                res.status(200).redirect('/change_password');
            } else {
                res.status(401).redirect('/forget/otp/verify');
            }
        } catch (error) {
            res.status(500).send('Internal server error')
        }
    },

    getChangePassword: (req, res) => {
        try {
            res.status(200).render('user/changePassword')
        } catch (error) {
            res.status(500).send('internal error')
        }
    },


    postChangePassword: async (req, res) => {
        try {
            const email = req.session.otp_email;
            const { confirmPassword, password } = req.body;

            const userExist = await customerModel.findOne({ email });

            if (!userExist || password !== confirmPassword) {
                return res.redirect('/user/changePassword');
            }
            
            const hashPassword = await bcrypt.hash(password, 10);
            await customerModel.updateOne({ email }, { $set: { password: hashPassword } });
            res.redirect('/');
        } catch (error) {
            console.error(error.message);
            res.status(500);
        }
    }
}