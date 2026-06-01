// ============================================
// AUTH SERVICE – Business Logic
// ============================================

const User          = require("../models/User");
const { generateToken } = require("../utils/tokenUtils");

/**
 * registerUser - Creates a new user account
 */
const registerUser = async (data) => {
  const { name, email, password, phone, address } = data;

  // Check if email already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    const err = new Error("An account with this email already exists.");
    err.statusCode = 409;
    throw err;
  }

  // Create user (password hashed by pre-save hook)
  const user = await User.create({ name, email, password, phone, address });

  const token = generateToken({ id: user._id, role: user.role });

  return { user: user.toPublicJSON(), token };
};

/**
 * loginUser - Authenticates a user and returns token
 */
const loginUser = async (email, password) => {
  // Find user with password field (normally excluded)
  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

  if (!user) {
    const err = new Error("Invalid email or password.");
    err.statusCode = 401;
    throw err;
  }

  // Compare password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const err = new Error("Invalid email or password.");
    err.statusCode = 401;
    throw err;
  }

  const token = generateToken({ id: user._id, role: user.role });

  return { user: user.toPublicJSON(), token };
};

/**
 * getMyProfile - Returns current user profile
 */
const getMyProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error("User not found.");
    err.statusCode = 404;
    throw err;
  }
  return user;
};

/**
 * updateMyProfile - Updates current user profile
 */
const updateMyProfile = async (userId, data) => {
  const allowedFields = ["name", "phone", "address"];
  const updates = {};
  allowedFields.forEach((field) => {
    if (data[field] !== undefined) updates[field] = data[field];
  });

  const user = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    const err = new Error("User not found.");
    err.statusCode = 404;
    throw err;
  }

  return user;
};

/**
 * changePassword - Changes user password
 */
const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select("+password");
  if (!user) {
    const err = new Error("User not found.");
    err.statusCode = 404;
    throw err;
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    const err = new Error("Current password is incorrect.");
    err.statusCode = 400;
    throw err;
  }

  user.password = newPassword;
  await user.save();
};

module.exports = { registerUser, loginUser, getMyProfile, updateMyProfile, changePassword };
