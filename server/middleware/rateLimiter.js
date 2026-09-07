const rateLimit = require('express-rate-limit');

// Configure rate limiting - defaults can be overridden via environment variables
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100, // limit each IP to 100 requests per windowMs
  message: { success: false, error: 'Too many requests, please try again later.' },
  standardHeaders: true, // Return rate limit info in the RateLimit-* headers
  legacyHeaders: false,
});

module.exports = limiter;
