const nodemailer = require("nodemailer");

const sendMail = async (email, message) => {
    try {
        let subject, html
        if (message ==='deliverd') {
            subject = "Your Order has been Delivered!";
            html = `<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);">
                <div style="padding: 20px;">
                    <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Order Delivered!</h2>
                    <p style="color: #333;">Dear Customer,</p>
                    <p style="color: #333;">We are pleased to inform you that your order has been successfully delivered.</p>
                    <p style="color: #333;">Thank you for shopping with us!</p>
                    <div style="text-align: center; margin-top: 20px;">
                        <a href="#" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Shop Again</a>
                    </div>
                </div>
            </div>
        </div>
        `;
        } else {
            subject = "message Verification";
            html = `<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);">
                    <div style="padding: 20px;">
                        <h2 style="color: #333;">Welcome to Cartscape!</h2>
                        <p style="color: #666;"></p>
                        <p style="color: #333;">Your OTP for verification is <strong>${message}</strong>.</p>
                        <p style="color: #333;">Please use this OTP to complete your registration process.</p>
                    </div>
                </div>
            </div>`;
        }
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });
        let mailOption = {
            from: process.env.EMAIL,
            to: email,
            subject: subject,
            html: html
        };
        await transporter.sendMail(mailOption);
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = sendMail;
