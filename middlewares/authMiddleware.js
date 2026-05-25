// ============================================
// AUTHENTICATION & AUTHORIZATION MIDDLEWARE
// Protects routes and handles RBAC (Role-Based Access Control)
// ============================================

const { verifyToken } = require("../utils/tokenUtils");
const { sendError }   = require("../utils/apiResponse");
const User            = require("../models/User");

/**
 * protect - Verifies JWT token and attaches user to req
 * Handles token expiry separately for better UX
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Extract token from Authorization header: "Bearer <token>"
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return sendError(res, 401, "Access denied. No token provided. Please login.");
    }

    // Verify token (handles expiry & invalid token with specific messages)
    const decoded = verifyToken(token);

    // Fetch fresh user from DB (ensures user still exists & is active)
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return sendError(res, 401, "The user belonging to this token no longer exists.");
    }

    if (!user.isActive) {
      return sendError(res, 401, "Your account has been deactivated. Please contact support.");
    }

    req.user = user;
    next();
  } catch (error) {
    return sendError(res, error.statusCode || 401, error.message);
  }
};

/**
 * authorize - Role-Based Access Control (RBAC)
 * Restricts access to specific roles
 * Usage: authorize("admin") or authorize("admin", "moderator")
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return sendError(
        res,
        403,
        `Access forbidden. Role '${req.user.role}' is not authorized to access this resource.`
      );
    }
    next();
  };
};

module.exports = { protect, authorize };
