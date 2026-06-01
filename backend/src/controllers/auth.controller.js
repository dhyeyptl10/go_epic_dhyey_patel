// ============================================
// AUTH CONTROLLER – Session-Based Auth
// Go-Epic Backend
// Register, Login, Logout, Profile
// ============================================

const bcrypt              = require('bcryptjs');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { sanitizeUser }    = require('../utils/helpers');
const { users, sessions } = require('../data/users.data');

// POST /api/v1/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = users.find(u => u.email === email.toLowerCase());
    if (existing) return errorResponse(res, 'Email is already registered. Please login.', 409);

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id:        `user_${Date.now()}`,
      name:      name.trim(),
      email:     email.toLowerCase().trim(),
      password:  hashedPassword,
      role:      'user',
      isActive:  true,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    return successResponse(res, sanitizeUser(newUser), 'Registration successful! Welcome to Go-Epic 🎯', 201);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// POST /api/v1/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email.toLowerCase() && u.isActive);
    if (!user) return errorResponse(res, 'Invalid email or password', 401);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return errorResponse(res, 'Invalid email or password', 401);

    // Create session
    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
    sessions[sessionId] = { userId: user.id, email: user.email, role: user.role, loginAt: new Date().toISOString() };

    return successResponse(res, {
      user:      sanitizeUser(user),
      sessionId,
      message:   'Use sessionId in X-Session-ID header for session-based routes'
    }, 'Login successful!');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// POST /api/v1/auth/logout
const logout = (req, res) => {
  try {
    const sessionId = req.headers['x-session-id'];
    if (sessionId && sessions[sessionId]) {
      delete sessions[sessionId];
    }
    return successResponse(res, null, 'Logout successful. See you soon! 👋');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// GET /api/v1/auth/profile
const getProfile = (req, res) => {
  try {
    const sessionId = req.headers['x-session-id'];
    if (!sessionId || !sessions[sessionId]) {
      return errorResponse(res, 'Not authenticated. Please login first.', 401);
    }
    const session = sessions[sessionId];
    const user    = users.find(u => u.id === session.userId && u.isActive);
    if (!user) return errorResponse(res, 'User not found', 404);
    return successResponse(res, sanitizeUser(user), 'Profile fetched successfully');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// PATCH /api/v1/auth/profile
const updateProfile = (req, res) => {
  try {
    const sessionId = req.headers['x-session-id'];
    if (!sessionId || !sessions[sessionId]) {
      return errorResponse(res, 'Not authenticated. Please login first.', 401);
    }
    const session   = sessions[sessionId];
    const userIndex = users.findIndex(u => u.id === session.userId);
    if (userIndex === -1) return errorResponse(res, 'User not found', 404);

    const { name } = req.body;
    if (name) users[userIndex].name = name.trim();
    users[userIndex].updatedAt = new Date().toISOString();

    return successResponse(res, sanitizeUser(users[userIndex]), 'Profile updated successfully');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

module.exports = { register, login, logout, getProfile, updateProfile };
