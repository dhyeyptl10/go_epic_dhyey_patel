// ============================================
// AUTH ROUTES – /api/v1/auth
// ============================================

const express = require("express");
const router  = express.Router();

const { register, login, getMe, updateMe, changePassword, logout } = require("../controllers/authController");
const { protect }     = require("../middlewares/authMiddleware");
const { authLimiter } = require("../middlewares/rateLimitMiddleware");

// Public routes (with auth-specific rate limiting)
router.post("/register", authLimiter, register);
router.post("/login",    authLimiter, login);

// Protected routes (require valid JWT)
router.get( "/me",              protect, getMe);
router.put( "/me",              protect, updateMe);
router.put( "/change-password", protect, changePassword);
router.post("/logout",          protect, logout);

module.exports = router;
