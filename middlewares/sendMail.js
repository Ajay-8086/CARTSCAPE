const nodemailer = require("nodemailer");
const  sendMail = async(email,text)=>{
   try{
    const myEmail = process.env.EMAIL;
    const myPassword = process.env.PASSWORD;
    let transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:myEmail,
            pass:myPassword
        }
    })
    let mailOption = {
        from:myEmail,
        to:email,
        subject:"OTP Verification",
        text:text
    }
    const info = await transporter.sendMail(mailOption)
    console.log(info.response);
   }catch(error){
    console.log(error.message);
   }
}




module.exports=sendMail