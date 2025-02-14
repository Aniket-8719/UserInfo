const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { registerValidator, loginValidator } = require("../utils/validator");

// Register
exports.register = async (req, res) => {
  const { error } = registerValidator(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const {
      userName,
      fullName,
      email,
      password,
      gender,
      dateOfBirth,
      country,
    } = req.body;

    const existingUser = await User.findOne({
      $or: [{ userName }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({
        message:
          existingUser.userName === userName
            ? "UserName is already taken"
            : "Email is already registered",
      });
    }
    if (!password || typeof password !== "string") {
      return res
        .status(400)
        .json({ message: "Password must be a valid string" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = await User.create({
      userName,
      fullName,
      email,
      password: hashedPassword,
      gender,
      dateOfBirth,
      country,
    });

    //  Creating Token and saving in cookie
    const token = newUser.getJWTToken();

    // options for cookie
    const options = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };

    return res.status(201).cookie("token", token, options).json({
      success: true,
      newUser,
      token,
    });
  } catch (error) {
    console.error("Error in register:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

// Login
exports.login = async (req, res) => {
  const { error } = loginValidator(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    //  Creating Token and saving in cookie
    const token = user.getJWTToken();

    // options for cookie
    const options = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };

    return res.status(201).cookie("token", token, options).json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// User Details
exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

//  Logout User
exports.logout = async (req, res, next) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    return res.status(200).json({
      success: true,
      message: "Logged Out",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// Search User by userName
exports.searchUser = async (req, res) => {
  try {
    const { userName } = req.query;
    if (!userName)
      return res.status(400).json({ message: "UserName query parameter is required" });
    const users = await User.find(
      { userName: new RegExp(userName, "i") },
      "userName email"
    );
    if(users.length === 0){
     return res.status(400).json({success:false, message:`${userName} is Not present`});
    }
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};
