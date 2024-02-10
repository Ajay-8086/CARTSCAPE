const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const userRouter = require('./routes/userRouter')
const adminRouter = require('./routes/adminRoutes')
const flash = require('connect-flash');
const session = require('express-session')
const morgan = require('morgan');
const dbConnection = require('./config/DB')
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(flash());
app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true
}))
// const customFormat = ':method :url :status - :response-time ms';
// app.use(morgan(customFormat));

app.use('/admin', adminRouter)
app.use('/', userRouter)

dbConnection().then(()=>{
    
    app.listen(port, () => {
        console.log(`server running at ${port}`)
    })
}).catch(()=>{
    console.log('Error in connecting database');
})
