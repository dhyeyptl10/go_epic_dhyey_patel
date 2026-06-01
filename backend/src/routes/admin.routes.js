// ============================================
// ADMIN ROUTES – Go-Epic Backend
// Admin-only user management routes
// ============================================

const express = require('express');
const router  = express.Router();

const { successResponse, errorResponse } = require('../utils/apiResponse');
const { sanitizeUser }                   = require('../utils/helpers');
const { users }                          = require('../data/users.data');
const authMiddleware                      = require('../middleware/auth.middleware');
const adminMiddleware                     = require('../middleware/admin.middleware');

// All admin routes require auth + admin role
router.use(authMiddleware, adminMiddleware);

// GET /api/v1/admin/users  – get all users
router.get('/users', (req, res) => {
  try {
    return successResponse(res, users.map(sanitizeUser), 'All users fetched successfully');
  } catch (err) {
    return errorResponse(res, err.message);
  }
});

// GET /api/v1/admin/users/:userId
router.get('/users/:userId', (req, res) => {
  try {
    const user = users.find(u => u.id === req.params.userId);
    if (!user) return errorResponse(res, 'User not found', 404);
    return successResponse(res, sanitizeUser(user), 'User fetched');
  } catch (err) {
    return errorResponse(res, err.message);
  }
});

// PATCH /api/v1/admin/users/:userId  – update role or status
router.patch('/users/:userId', (req, res) => {
  try {
    const index = users.findIndex(u => u.id === req.params.userId);
    if (index === -1) return errorResponse(res, 'User not found', 404);
    const { role, isActive } = req.body;
    if (role)     users[index].role     = role;
    if (isActive !== undefined) users[index].isActive = isActive;
    users[index].updatedAt = new Date().toISOString();
    return successResponse(res, sanitizeUser(users[index]), 'User updated by admin');
  } catch (err) {
    return errorResponse(res, err.message);
  }
});

// DELETE /api/v1/admin/users/:userId  – deactivate user
router.delete('/users/:userId', (req, res) => {
  try {
    const index = users.findIndex(u => u.id === req.params.userId);
    if (index === -1) return errorResponse(res, 'User not found', 404);
    if (users[index].role === 'admin') return errorResponse(res, 'Cannot deactivate another admin', 403);
    users[index].isActive  = false;
    users[index].deletedAt = new Date().toISOString();
    return successResponse(res, null, 'User deactivated successfully');
  } catch (err) {
    return errorResponse(res, err.message);
  }
});

// GET /api/v1/admin/stats  – admin dashboard
router.get('/stats', (req, res) => {
  try {
    const problems  = require('../data/problems.data');
    const topics    = require('../data/topics.data');
    const solutions = require('../data/solutions.data');
    const datasets  = require('../data/datasets.data');

    return successResponse(res, {
      users:     { total: users.length, active: users.filter(u => u.isActive).length, admins: users.filter(u => u.role === 'admin').length },
      problems:  { total: problems.length, active: problems.filter(p => p.isActive).length },
      topics:    { total: topics.length },
      solutions: { total: solutions.length },
      datasets:  { total: datasets.length, active: datasets.filter(d => d.isActive).length }
    }, 'Admin stats fetched successfully');
  } catch (err) {
    return errorResponse(res, err.message);
  }
});

module.exports = router;
