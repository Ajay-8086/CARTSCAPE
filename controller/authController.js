const adminModel = require('../models/admin')
const customerModel = require('../models/customer');
const sendMail = require('../utility/sendMail');
const { sendVerificationCode, verifyOtp } = require('../utility/verification')
const bcrypt = require('bcrypt')
const generateOTP = Math.floor(1000 + Math.random() * 9000);
module.exports = {
    //ADMIN AUTHENTICATION MANAGEMENT===========================================================================>

    getSignup: (req, res) => {
        try {
            res.status(200).render('admin/signup')
        } catch (error) {
            res.status(500).send('Internal sseerver error')
        }
    },
    postSignup: async (req, res) => {
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
                await adminModel.create(req.body)

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
                    res.status(200).redirect('/admin/dashboard')
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
    getLogin: (req, res) => {
        try {
            const errorMessages = req.flash('error');
            res.status(200).render('admin/login', { error: errorMessages });
        } catch (error) {
            res.status(500).send('Internal server error')
        }
    },
    postLogin: async (req, res) => {
        const { email, password } = req.body
        const adminExist = await adminModel.findOne({ email })

        if (adminExist) {
            if (adminExist.verified) {
                const passwordVerify = await bcrypt.compare(password, (adminExist.password))
                if (passwordVerify)
                    res.redirect('/admin/dashboard')
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

    //USER AUTHENTICATION MANAGEMENT===============================================================================>

    getLogin: (req, res) => {
        try {
            const errorMessage = req.flash('error')[0];
            res.status(200).render('user/login', { messages: { error: errorMessage } });
        } catch (error) {
            res.status(500).send('Internal server error')
        }
    },

    postLogin: async (req, res) => {
        try {
            const { email, password } = req.body;
            const userExist = await customerModel.findOne({ email });
            if (!userExist) {
                req.flash('error', 'User does not exist. Please register.');
                return res.status(400).redirect('/login');
            } else {
                const passwordCheck = await bcrypt.compare(password, userExist.password);
                if (passwordCheck) {
                    if (userExist.verified && !userExist.blocked) {
                        res.status(200).redirect('/')
                    } else {
                        req.flash('error', 'please verify otp');
                        res.status(400).redirect('/login')
                    }
                } else {
                    req.flash('error', 'Invalid password');
                    return res.status(401).redirect('/login');
                }
            }
        } catch (error) {
            res.status(500).send('Internal server error')
        }
    },


    getSignup: (req, res) => {
        try {
            res.status(200).render('user/signup')
        } catch (error) {
            res.status(500).send('Internal server error')
        }
    },

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
                    req.flash('error', { phone })
                    res.status(200).redirect('/verify-otp');
                    console.log(phone);
                    await sendVerificationCode(phone);
                }
            } else {


                const user = new customerModel({ name, email, phone, password: hashPassword });
                            await user.save();

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
        try {
            res.status(200).render('user/otpVerify', { error: req.flash('error')[0] })
        } catch (error) {
            res.status(500).send('Internal server error')
        }
    },

    postOtp: async (req, res) => {
        try {
            const { digit1, digit2, digit3, digit4, phone } = req.body;
            await verifyOtp(res, phone, `${digit1}${digit2}${digit3}${digit4}`);
            res.status(200).redirect('/login')
        } catch (error) {
            res.status(500).send('internal server error')
        }
    },

    getForgotPassword: (req, res) => {
        try {
            res.status(200).render('user/forgetPassword')
        } catch (error) {
            res.status(500).send('Internal server error')
        }
    },

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
        try {
            const { digit1, digit2, digit3, digit4 } = req.body;
            const userOtp = parseInt(`${digit1}${digit2}${digit3}${digit4}`);
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