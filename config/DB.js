const mongoose = require('mongoose');
const connectDB = async ()=>{
    try {
       const con =  await mongoose.connect(process.env.URI)
        console.log(`MongoDb connected:${con.connection.host}`);
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDB;