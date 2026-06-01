// ============================================
// RATE LIMIT MIDDLEWARE – Go-Epic Backend
// Protects API from abuse using express-rate-limit
// ============================================

const rateLimit = require('express-rate-limit');

// General API limiter – 100 requests per 15 minutes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
    timestamp: new Date().toISOString()
  }
});

// Strict auth limiter – 10 requests per 15 minutes (prevent brute-force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.',
    timestamp: new Date().toISOString()
  }
});

// Search limiter – 30 requests per minute
const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    message: 'Too many search requests. Please slow down.',
    timestamp: new Date().toISOString()
  }
});

module.exports = { generalLimiter, authLimiter, searchLimiter };
