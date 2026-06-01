// ============================================
// SEARCH ROUTES – Go-Epic Backend
// ============================================

const express = require('express');
const router  = express.Router();

const { searchProblems, searchTopics, searchSolutions, searchDatasets, searchAll } = require('../controllers/search.controller');
const { searchLimiter } = require('../middleware/rateLimit.middleware');

// Apply search rate limiter to all search routes
router.use(searchLimiter);

// GET /api/v1/search/problems?q=worker
router.get('/problems',  searchProblems);

// GET /api/v1/search/topics?q=concurrency
router.get('/topics',    searchTopics);

// GET /api/v1/search/solutions?q=mutex
router.get('/solutions', searchSolutions);

// GET /api/v1/search/datasets?q=advanced
router.get('/datasets',  searchDatasets);

// GET /api/v1/search/all?q=array  (global search)
router.get('/all',       searchAll);

module.exports = router;
