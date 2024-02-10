const nodemailer = require("nodemailer");
const  sendMail = async(email,text)=>{
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
        text:text
    }
    await transporter.sendMail(mailOption)
   }catch(error){
    console.log(error.message);
   }
}




module.exports=sendMail