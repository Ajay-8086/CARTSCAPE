const customerModel = require('../models/customer');
const client = require('twilio')(process.env.SID, process.env.AUTH_TOKEN);
const serviceSid = process.env.SERVICE_SID;

// Function to send verification code
async function sendVerificationCode(phone) {
    try {
        await client.verify.v2.services(serviceSid).verifications.create({ to: `+91${phone}`, channel: 'sms' });
        return true;
    } catch (error) {
        console.error('Error sending verification code:', error);
        return false;
    }
}

// Function to verify OTP
async function verifyOtp(res, phone, digits) {
    try {
        const verificationCheck = await client.verify.v2.services(serviceSid)
            .verificationChecks.create({ to: `+91${phone}`, code: digits });

        if (verificationCheck.status === 'approved') {
            await updateCustomerVerificationStatus(phone);
            res.redirect('/login');
        } else {
            res.redirect('/signup');
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.redirect('/signup');
    }
}

// Function to update customer verification status in the database
async function updateCustomerVerificationStatus(phone) {
    try {
        await customerModel.updateOne({ phone }, { verified: true });
    } catch (error) {
        console.error('Error updating customer verification status:', error);
    }
}

module.exports = { sendVerificationCode, verifyOtp };
