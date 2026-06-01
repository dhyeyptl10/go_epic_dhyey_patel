// ============================================
// AUTH MIDDLEWARE – JWT Token Verification
// Go-Epic Backend
// ============================================

const jwt              = require('jsonwebtoken');
const { errorResponse } = require('../utils/apiResponse');

const JWT_SECRET = process.env.JWT_SECRET || 'go_epic_super_secret_key_2026';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 'Access denied. No token provided. Please login first.', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token has expired. Please login again.', 401);
    }
    return errorResponse(res, 'Invalid token. Authentication failed.', 401);
  }
};

module.exports = authMiddleware;
