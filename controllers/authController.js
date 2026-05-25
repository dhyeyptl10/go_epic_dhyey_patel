// ============================================
// AUTH CONTROLLER – Request/Response Only
// Business logic delegated to authService
// ============================================

const asyncHandler  = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const { validateRegister, validateLogin } = require("../utils/validator");
const authService   = require("../services/authService");

// @desc    Register new user
// @route   POST /api/v1/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  // Custom validation layer
  const errors = validateRegister(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(", ") });
  }

  const { user, token } = await authService.registerUser(req.body);

  sendSuccess(res, 201, "Account created successfully! Welcome aboard.", { user, token });
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const errors = validateLogin(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(", ") });
  }

  const { email, password } = req.body;
  const { user, token } = await authService.loginUser(email, password);

  sendSuccess(res, 200, "Login successful. Welcome back!", { user, token });
});

// @desc    Get my profile
// @route   GET /api/v1/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMyProfile(req.user.id);
  sendSuccess(res, 200, "Profile fetched successfully.", { user });
});

// @desc    Update my profile
// @route   PUT /api/v1/auth/me
// @access  Private
const updateMe = asyncHandler(async (req, res) => {
  const user = await authService.updateMyProfile(req.user.id, req.body);
  sendSuccess(res, 200, "Profile updated successfully.", { user });
});

// @desc    Change password
// @route   PUT /api/v1/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Both currentPassword and newPassword are required.",
    });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: "New password must be at least 6 characters.",
    });
  }

  await authService.changePassword(req.user.id, currentPassword, newPassword);
  sendSuccess(res, 200, "Password changed successfully. Please login again with your new password.");
});

// @desc    Logout (client-side token removal – informational)
// @route   POST /api/v1/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  sendSuccess(res, 200, "Logged out successfully. Please remove token from client.");
});

module.exports = { register, login, getMe, updateMe, changePassword, logout };
