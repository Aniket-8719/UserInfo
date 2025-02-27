const rateLimit = require("express-rate-limit");

// Custom response handler for rate limit errors
const handleRateLimitError = (req, res, next, options) => {
  res.status(options.statusCode || 429).json({
    success: false,
    message: options.message || "Too many requests, please try again later.",
  });
};

// Custom key generator for login attempts
const keyGenerator = (req) => {
  // Use a combination of IP address and User-Agent header to identify unique devices on the same network
  return req.ip + req.headers["user-agent"];
};

// Rate limiter for login
const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, 
  message: "Too many login attempts, please try again in 5 minutes.",
  keyGenerator, 
  handler: handleRateLimitError, // Use custom error handler
});


module.exports = { loginLimiter };
