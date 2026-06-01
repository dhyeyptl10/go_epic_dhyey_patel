// ============================================
// PROBLEM ROUTES – Go-Epic Backend
// ============================================

const express = require('express');
const router  = express.Router();

const {
  getAllProblems,
  getRandomProblem,
  getProblemById,
  createProblem,
  replaceProblem,
  updateProblem,
  deleteProblem
} = require('../controllers/problem.controller');

const { validateProblem } = require('../middleware/validation.middleware');
const authMiddleware      = require('../middleware/auth.middleware');
const adminMiddleware     = require('../middleware/admin.middleware');

// Public routes
router.get('/',           getAllProblems);    // GET  /api/v1/problems  + query params
router.get('/random',     getRandomProblem);  // GET  /api/v1/problems/random
router.get('/:problemId', getProblemById);    // GET  /api/v1/problems/:problemId

// Protected routes (admin only)
router.post('/',             authMiddleware, adminMiddleware, validateProblem, createProblem);  // POST   create
router.put('/:problemId',    authMiddleware, adminMiddleware, validateProblem, replaceProblem); // PUT    replace
router.patch('/:problemId',  authMiddleware, adminMiddleware, updateProblem);                   // PATCH  update
router.delete('/:problemId', authMiddleware, adminMiddleware, deleteProblem);                   // DELETE soft-delete

module.exports = router;
