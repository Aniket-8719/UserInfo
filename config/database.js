const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const data = await mongoose.connect(process.env.DB_URL);
        console.log(`Database connected successfully: ${data.connection.host}`);
       } catch (err) {
        console.log("Database connection error:", err);
        process.exit(1); 
    }
}; 
 
module.exports = connectDB;
