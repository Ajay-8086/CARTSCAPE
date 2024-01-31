const mongoose = require('mongoose');
const express = require('express');
const userRouter = require('./routes/userRouter')
const adminRouter = require('./routes/adminRoutes')
const flash = require('connect-flash');
const dotenv = require('dotenv');
const session = require('express-session')


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const connection = process.env.URI;
const secret = process.env.SECRET
mongoose.connect(connection)

app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.set('view engine' , 'ejs')


  
app.use(express.static('public'))

app.use(flash());
app.use(session({
    secret:secret,
    resave:true,
    saveUninitialized:true
}))

app.use('/',userRouter)
app.use('/',adminRouter)


app.listen(port,()=>{
    console.log(`server running at ${port}`)
})