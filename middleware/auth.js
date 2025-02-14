const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.isAuthenticatedUser = async(req, res, next)=>{
    try{
        const {token} = req.cookies; 
    if(!token){
        return res.status(401).json({ message: "Please Login to access this resources" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
      } catch (error) {
        return res.status(401).json({ message: "Not authorized to access this route" });
      }
    }catch(error){
        console.log(error);
        res.status(500).json({ message: "Server error", error });
    } 
}; 