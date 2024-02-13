const nodemailer = require("nodemailer");
const  sendMail = async(email,otp)=>{
   try{
    let transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:process.env.EMAIL,
            pass:process.env.PASSWORD
        }
    })
    let mailOption = {
        from:process.env.EMAIL,
        to:email,
        subject:"OTP Verification",
        html:`<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);">
            <div style="padding: 20px;">
                <h2 style="color: #333;">Welcome to Cartscape!</h2>
                <p style="color: #666;"></p>
                <p style="color: #333;">Your OTP for verification is <strong>${otp}</strong>.</p>
                <p style="color: #333;">Please use this OTP to complete your registration process.</p>
            </div>
        </div>
    </div>`
    }
    await transporter.sendMail(mailOption)
   }catch(error){
    console.log(error.message);
   }
}




module.exports=sendMail