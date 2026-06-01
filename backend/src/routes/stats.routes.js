// ============================================
// STATS ROUTES – Go-Epic Backend
// ============================================

const express = require('express');
const router  = express.Router();

const { getProblemStats, getTopicStats, getSolutionStats, getDatasetStats, getOverallStats } = require('../controllers/stats.controller');

// GET /api/v1/stats/overview  – platform-wide summary
router.get('/overview',  getOverallStats);

// GET /api/v1/stats/problems
router.get('/problems',  getProblemStats);

// GET /api/v1/stats/topics
router.get('/topics',    getTopicStats);

// GET /api/v1/stats/solutions
router.get('/solutions', getSolutionStats);

// GET /api/v1/stats/datasets
router.get('/datasets',  getDatasetStats);

module.exports = router;
