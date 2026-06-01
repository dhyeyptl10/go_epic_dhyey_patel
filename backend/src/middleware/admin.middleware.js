// ============================================
// ADMIN MIDDLEWARE – Role-Based Access Control
// Go-Epic Backend
// ============================================

const { errorResponse } = require('../utils/apiResponse');

const adminMiddleware = (req, res, next) => {
  if (!req.user) {
    return errorResponse(res, 'Authentication required.', 401);
  }
  if (req.user.role !== 'admin') {
    return errorResponse(res, 'Access denied. Admin privileges required.', 403);
  }
  next();
};

module.exports = adminMiddleware;
