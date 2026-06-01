// ============================================
// JWT ROUTES – Token-Based Auth
// Go-Epic Backend
// ============================================

const express = require('express');
const router  = express.Router();

const { generateToken, verifyToken, refreshToken, getJwtProfile, getJwtDashboard } = require('../controllers/jwt.controller');
const authMiddleware  = require('../middleware/auth.middleware');
const { authLimiter } = require('../middleware/rateLimit.middleware');

// Public JWT routes
router.post('/generate-token', authLimiter, generateToken); // POST – login via JWT
router.post('/verify-token',   verifyToken);                // POST – verify token validity
router.post('/refresh-token',  refreshToken);               // POST – refresh access token

// Protected JWT routes (requires Bearer token)
router.get('/profile',   authMiddleware, getJwtProfile);    // GET – profile via JWT
router.get('/dashboard', authMiddleware, getJwtDashboard);  // GET – dashboard via JWT

module.exports = router;
