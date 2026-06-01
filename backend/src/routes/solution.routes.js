// ============================================
// SOLUTION ROUTES – Go-Epic Backend
// ============================================

const express = require('express');
const router  = express.Router();

const {
  getAllSolutions,
  getSolutionById,
  createSolution,
  replaceSolution,
  updateSolution,
  deleteSolution
} = require('../controllers/solution.controller');

const authMiddleware  = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

// Public routes
router.get('/',              getAllSolutions);   // GET /api/v1/solutions
router.get('/:solutionId',   getSolutionById);  // GET /api/v1/solutions/:solutionId

// Protected routes
router.post('/',               authMiddleware, createSolution);                          // POST (any logged-in user)
router.put('/:solutionId',     authMiddleware, adminMiddleware, replaceSolution);         // PUT (admin)
router.patch('/:solutionId',   authMiddleware, adminMiddleware, updateSolution);          // PATCH (admin)
router.delete('/:solutionId',  authMiddleware, adminMiddleware, deleteSolution);          // DELETE (admin)

module.exports = router;
