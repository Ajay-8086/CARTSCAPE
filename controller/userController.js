const customerModel = require('../models/customer');
const sendMail = require('../middlewares/sendMail');
const{sendVerificationCode,verifyOtp} = require('../middlewares/verification')
const bcrypt = require('bcrypt');

const generateOTP = Math.floor(1000 + Math.random() * 9000);
module.exports = {
    home: (req, res) => res.render('user/userDashboard'),

    getLogin: (req, res) => {
        const errorMessage = req.flash('error')[0]; 
        res.render('user/login', { messages: { error: errorMessage } });
    },

    postLogin: async (req, res) => {
        const { email, password } = req.body;
        const userExist = await customerModel.findOne({ email });
        console.log(userExist);
    
        if (!userExist) {
            req.flash('error', 'User does not exist. Please register.');
            return res.redirect('/login');
        } else {
            const passwordCheck = await bcrypt.compare(password, userExist.password);
            if (passwordCheck) {
              if(userExist.verified){
                res.redirect('/')
              }else{
                req.flash('error','please verify otp');
                res.redirect('/login')
              }
        } else {
            req.flash('error', 'Invalid password');
            return res.redirect('/login');
        }
    }
    },
    

    getSignup: (req, res) => res.render('user/signup'),

    postSignup: async (req, res) => {
        try {
            const { name, email, phone, password } = req.body;
            const hashPassword = await bcrypt.hash(password, 10);
            const userExist = await customerModel.findOne({ phone });

            if (userExist) {
                if (userExist.verified) {
                    console.log('user role');
                    return res.status(200).redirect('/login');
                } else {
                    console.log('user not role');
                    req.flash('error', {phone})
                    res.status(200).redirect('/verify-otp');
                    console.log(phone);
                    await sendVerificationCode(phone);
                }
            } else {
                console.log('user save');
                
                const user = new customerModel({ name, email, phone, password: hashPassword });
                const saveData = await user.save();
                
                await sendVerificationCode(phone);
                if (saveData) {
                    req.flash('error', { phone })
                    res.status(200).redirect('/verify-otp');
                }
            }
        } catch (err) {
            console.error('Error sending verification code:', err);
            res.status(500).json({ error: 'Failed to send verification code.' });
        }
    },

    getOtp: (req, res) => {
        
        res.render('user/otpVerify',{ error: req.flash('error')[0] })
    },

    postOtp: async (req, res) => {
        const { digit1, digit2, digit3, digit4 ,phone } = req.body;
        
        console.log('post otp ',phone);
        await verifyOtp(res, phone, `${digit1}${digit2}${digit3}${digit4}`);
    },

    getForgotPassword: (req, res) => res.render('user/forgetPassword'),

    postForgotPassword: async (req, res) => {
        try {
            const { email } = req.body;
            const userExist = await customerModel.findOne({ email });
            req.session.otp_email = email;

            if (!userExist) {
                return res.status(400).send('User not found');
            }

            await sendMail(email, `Your OTP for verification is ${generateOTP}`);
            res.redirect('/forget/otp/verify');
        } catch (error) {
            console.error('Unexpected error:', error);
            res.status(500).send('Internal Server Error');
        }
    },

    getForgetOtp: (req, res) => res.render('user/forgotOtp'),

    resendOtp: async (req, res) => {
      try {
        const email = req.session.otp_email;
        await sendMail(email, `Your OTP for verification is ${generateOTP}`);
        res.redirect('/forget/otp/verify');
      } catch (error) {
        res.atatus(500).send('Internal server error')
      }
    },

    postForgetOtp: (req, res) => {
        const { digit1, digit2, digit3, digit4 } = req.body;
        const userOtp = parseInt(`${digit1}${digit2}${digit3}${digit4}`);
        if (generateOTP === userOtp) {
            res.status(200).redirect('/change_password');
        } else {
            res.status(401).redirect('/forget/otp/verify');
        }
    },

    getChangePassword: (req, res) => res.render('user/changePassword'),

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
    },

    getCart: (req, res) => res.render('user/cart'),

    getWishList: (req, res) => res.render('user/wishlist')
};
