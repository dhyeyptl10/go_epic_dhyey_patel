// ============================================
// JWT CONTROLLER – Token-Based Auth
// Go-Epic Backend
// Generate, Verify, Refresh JWT tokens
// ============================================

const jwt              = require('jsonwebtoken');
const bcrypt           = require('bcryptjs');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { sanitizeUser } = require('../utils/helpers');
const { users }        = require('../data/users.data');

const JWT_SECRET          = process.env.JWT_SECRET          || 'go_epic_super_secret_key_2026';
const JWT_EXPIRES_IN      = process.env.JWT_EXPIRES_IN      || '7d';
const JWT_REFRESH_SECRET  = process.env.JWT_REFRESH_SECRET  || 'go_epic_refresh_secret_2026';
const JWT_REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

// Helper – sign tokens
const signAccessToken  = (payload) => jwt.sign(payload, JWT_SECRET,         { expiresIn: JWT_EXPIRES_IN });
const signRefreshToken = (payload) => jwt.sign(payload, JWT_REFRESH_SECRET,  { expiresIn: JWT_REFRESH_EXPIRES });

// In-memory refresh token store
const refreshTokens = new Set();

// POST /api/v1/jwt/generate-token   (login via JWT)
const generateToken = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return errorResponse(res, 'email and password are required', 400);

    const user = users.find(u => u.email === email.toLowerCase() && u.isActive);
    if (!user) return errorResponse(res, 'Invalid credentials', 401);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return errorResponse(res, 'Invalid credentials', 401);

    const payload = { id: user.id, email: user.email, role: user.role, name: user.name };
    const accessToken  = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);
    refreshTokens.add(refreshToken);

    return successResponse(res, {
      accessToken,
      refreshToken,
      expiresIn: JWT_EXPIRES_IN,
      tokenType: 'Bearer',
      user: sanitizeUser(user)
    }, 'JWT tokens generated successfully!');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// POST /api/v1/jwt/verify-token
const verifyToken = (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return errorResponse(res, 'token is required', 400);
    const decoded = jwt.verify(token, JWT_SECRET);
    return successResponse(res, { valid: true, decoded }, 'Token is valid ✅');
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token has expired', 401);
    }
    return errorResponse(res, 'Invalid token', 401);
  }
};

// POST /api/v1/jwt/refresh-token
const refreshToken = (req, res) => {
  try {
    const { refreshToken: token } = req.body;
    if (!token) return errorResponse(res, 'refreshToken is required', 400);
    if (!refreshTokens.has(token)) return errorResponse(res, 'Invalid or revoked refresh token', 401);

    const decoded     = jwt.verify(token, JWT_REFRESH_SECRET);
    const payload     = { id: decoded.id, email: decoded.email, role: decoded.role, name: decoded.name };
    const newAccess   = signAccessToken(payload);
    const newRefresh  = signRefreshToken(payload);

    // Rotate refresh token
    refreshTokens.delete(token);
    refreshTokens.add(newRefresh);

    return successResponse(res, {
      accessToken:  newAccess,
      refreshToken: newRefresh,
      expiresIn:    JWT_EXPIRES_IN,
      tokenType:    'Bearer'
    }, 'Tokens refreshed successfully!');
  } catch (err) {
    return errorResponse(res, 'Refresh token is invalid or expired', 401);
  }
};

// GET /api/v1/jwt/profile  (requires Bearer token)
const getJwtProfile = (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.id && u.isActive);
    if (!user) return errorResponse(res, 'User not found', 404);
    return successResponse(res, sanitizeUser(user), 'JWT Profile fetched successfully');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// GET /api/v1/jwt/dashboard  (requires Bearer token)
const getJwtDashboard = (req, res) => {
  try {
    const problems  = require('../data/problems.data');
    const topics    = require('../data/topics.data');
    const solutions = require('../data/solutions.data');

    return successResponse(res, {
      welcome: `Welcome back, ${req.user.name}! 🎯`,
      role:    req.user.role,
      stats: {
        totalProblems:  problems.filter(p => p.isActive).length,
        totalTopics:    topics.length,
        totalSolutions: solutions.length
      },
      quickLinks: {
        randomProblem: '/api/v1/problems/random',
        popularTopics: '/api/v1/topics/popular',
        search:        '/api/v1/search/problems?q=<keyword>'
      }
    }, 'Dashboard loaded successfully');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

module.exports = { generateToken, verifyToken, refreshToken, getJwtProfile, getJwtDashboard };
