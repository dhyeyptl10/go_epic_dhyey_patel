// ============================================
// AUTH ROUTES – Session-Based Auth
// Go-Epic Backend
// ============================================

const express = require('express');
const router  = express.Router();

const { register, login, logout, getProfile, updateProfile } = require('../controllers/auth.controller');
const { validateRegister, validateLogin }                     = require('../middleware/validation.middleware');
const { authLimiter }                                         = require('../middleware/rateLimit.middleware');

// POST /api/v1/auth/register  – rate limited
router.post('/register', authLimiter, validateRegister, register);

// POST /api/v1/auth/login     – rate limited
router.post('/login',    authLimiter, validateLogin, login);

// POST /api/v1/auth/logout
router.post('/logout', logout);

// GET  /api/v1/auth/profile   – requires X-Session-ID header
router.get('/profile',   getProfile);

// PATCH /api/v1/auth/profile  – requires X-Session-ID header
router.patch('/profile', updateProfile);

module.exports = router;
