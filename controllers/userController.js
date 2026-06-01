// ============================================
// USER CONTROLLER – Request/Response Only
// ============================================

const asyncHandler    = require("../utils/asyncHandler");
const { sendSuccess, sendPaginated } = require("../utils/apiResponse");
const userService     = require("../services/userService");

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const { users, pagination } = await userService.getAllUsers(req.query);
  sendPaginated(res, "Users fetched successfully.", users, pagination);
});

// @desc    Get user by ID
// @route   GET /api/v1/users/:id
// @access  Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  sendSuccess(res, 200, "User fetched successfully.", { user });
});

// @desc    Update user
// @route   PUT /api/v1/users/:id
// @access  Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);
  sendSuccess(res, 200, "User updated successfully.", { user });
});

// @desc    Soft delete user
// @route   DELETE /api/v1/users/:id
// @access  Admin
const deleteUser = asyncHandler(async (req, res) => {
  await userService.softDeleteUser(req.params.id);
  sendSuccess(res, 200, "User deleted successfully (soft delete applied).");
});

// @desc    Get user statistics – Aggregation
// @route   GET /api/v1/users/stats
// @access  Admin
const getUserStats = asyncHandler(async (req, res) => {
  const stats = await userService.getUserStats();
  sendSuccess(res, 200, "User statistics fetched successfully.", { stats });
});

module.exports = { getAllUsers, getUserById, updateUser, deleteUser, getUserStats };
