const dotenv = require('dotenv');
const customerModel = require('../models/customer');
dotenv.config();
const accountSid = process.env.SID;
const authToken = process.env.AUTH_TOKEN;
const serviceSid = process.env.SERVICE_SID;
const client = require('twilio')(accountSid, authToken);


const sendVerificationCode = async (phone) => {
    return client.verify.v2.services(serviceSid).verifications.create({ to: `+91${phone}`, channel: 'sms' });
};


const verifyOtp = async (res, phone, digits) => {
    const verificationCheck = await client.verify.v2.services(serviceSid)
        .verificationChecks.create({ to: `+91${phone}`, code: digits });

    if (verificationCheck.status === 'approved') {
        await customerModel.findOneAndUpdate({ phone }, { $set: { role: true } });
        res.redirect('/login');
    } else {
        res.redirect('/signup');
    }
};

module.exports = {sendVerificationCode,verifyOtp}