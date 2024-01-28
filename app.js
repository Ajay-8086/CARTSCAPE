const mongoose = require('mongoose');
const express = require('express');
const userRouter = require('./routes/userRouter')
// const flash = require('connect-flash');
const dotenv = require('dotenv');


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const connection = process.env.URI;
mongoose.connect(connection)

app.use(express.json())

app.use(express.urlencoded({extended:true}))
app.set('view engine' , 'ejs')


  
app.use(express.static('public'))

app.use('/',userRouter)


app.listen(port,()=>{
    console.log(`server running at ${port}`)
})