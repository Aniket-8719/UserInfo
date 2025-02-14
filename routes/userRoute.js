const express = require("express");
const { register, login, logout, getUserDetails, searchUser } = require("../controllers/userController");
const { isAuthenticatedUser } = require("../middleware/auth");
const { loginLimiter } = require("../middleware/rateLimitor");

const router = express.Router();

router.post("/register", register);
router.post("/login", loginLimiter, login);
router.get("/me",isAuthenticatedUser, getUserDetails);
router.get("/logout", logout);
router.get("/search", isAuthenticatedUser, searchUser);

module.exports = router;