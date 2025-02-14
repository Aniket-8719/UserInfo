const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, unique: true, trim: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    gender: { type: String, required: true, enum: ["Male", "Female", "Other"] },
    dateOfBirth: { type: Date, required: true },
    country: { type: String, required: true },
  },
  { timestamps: true }
);

// Ensure index creation
userSchema.index({ userName: 1 }, { unique: true });


// JWT TOKEN
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_TIME,
    });
  };

module.exports = mongoose.model("User", userSchema);