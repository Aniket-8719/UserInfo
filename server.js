const app = require("./app");
const dotenv = require("dotenv");
const connectDB = require("./config/database");

// config file
dotenv.config({path:"./config/.env"});

// server is running
const server = app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port http://localhost:${process.env.PORT}`);
});

connectDB();

// Handling Uncought Exception ---> when you declare irrelevant console.log(youtube);
process.on("uncaughtException", (err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`shutting down the server due to uncaught Exception `);
    server.close(()=>{
        process.exit(1);
    })
});
  

