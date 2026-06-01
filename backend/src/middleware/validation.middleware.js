// ============================================
// VALIDATION MIDDLEWARE – Request Validators
// Go-Epic Backend
// ============================================

const { errorResponse } = require('../utils/apiResponse');

// Validate problem body
const validateProblem = (req, res, next) => {
  const { title, description, difficulty, topic } = req.body;
  const errors = [];

  if (!title || title.trim() === '')                                              errors.push('title is required');
  if (!description || description.trim() === '')                                  errors.push('description is required');
  if (!difficulty)                                                                errors.push('difficulty is required');
  if (!['easy', 'medium', 'hard', 'advanced'].includes(difficulty))              errors.push("difficulty must be 'easy', 'medium', 'hard', or 'advanced'");
  if (!topic || topic.trim() === '')                                              errors.push('topic is required');

  if (errors.length > 0) return errorResponse(res, 'Validation failed', 400, errors);
  next();
};

// Validate topic body
const validateTopic = (req, res, next) => {
  const { name, displayName, description } = req.body;
  const errors = [];

  if (!name || name.trim() === '')                                                errors.push('name is required');
  if (!displayName || displayName.trim() === '')                                  errors.push('displayName is required');
  if (!description || description.trim() === '')                                  errors.push('description is required');

  if (errors.length > 0) return errorResponse(res, 'Validation failed', 400, errors);
  next();
};

// Validate auth body (register)
const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || name.trim() === '')                                                errors.push('name is required');
  if (!email || email.trim() === '')                                              errors.push('email is required');
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))                       errors.push('Invalid email format');
  if (!password)                                                                  errors.push('password is required');
  if (password && password.length < 6)                                           errors.push('password must be at least 6 characters');

  if (errors.length > 0) return errorResponse(res, 'Validation failed', 400, errors);
  next();
};

// Validate auth body (login)
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || email.trim() === '')                                              errors.push('email is required');
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))                       errors.push('Invalid email format');
  if (!password)                                                                  errors.push('password is required');

  if (errors.length > 0) return errorResponse(res, 'Validation failed', 400, errors);
  next();
};

module.exports = { validateProblem, validateTopic, validateRegister, validateLogin };
