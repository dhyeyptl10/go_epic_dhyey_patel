// ============================================
// SEARCH CONTROLLER – Go-Epic Backend
// Global search across all entities
// ============================================

const { successResponse, errorResponse } = require('../utils/apiResponse');
const { filterByKeyword }                = require('../utils/helpers');

const problems  = require('../data/problems.data');
const topics    = require('../data/topics.data');
const solutions = require('../data/solutions.data');
const datasets  = require('../data/datasets.data');

// GET /api/v1/search/problems?q=worker
const searchProblems = (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') return errorResponse(res, 'Query param q is required. e.g. ?q=worker', 400);

    const results = filterByKeyword(
      problems.filter(p => p.isActive),
      q,
      ['title', 'description', 'topic', 'tags', 'source', 'difficulty']
    );
    return successResponse(res, { query: q, count: results.length, results }, `Found ${results.length} problems matching '${q}'`);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// GET /api/v1/search/topics?q=concurrency
const searchTopics = (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') return errorResponse(res, 'Query param q is required. e.g. ?q=concurrency', 400);

    const results = filterByKeyword(topics, q, ['name', 'displayName', 'description', 'tags', 'difficulty']);
    return successResponse(res, { query: q, count: results.length, results }, `Found ${results.length} topics matching '${q}'`);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// GET /api/v1/search/solutions?q=mutex
const searchSolutions = (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') return errorResponse(res, 'Query param q is required. e.g. ?q=mutex', 400);

    const results = filterByKeyword(solutions, q, ['title', 'approach', 'explanation', 'problemTitle', 'language']);
    return successResponse(res, { query: q, count: results.length, results }, `Found ${results.length} solutions matching '${q}'`);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// GET /api/v1/search/datasets?q=advanced
const searchDatasets = (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') return errorResponse(res, 'Query param q is required. e.g. ?q=advanced', 400);

    const results = filterByKeyword(
      datasets.filter(d => d.isActive),
      q,
      ['name', 'description', 'tags', 'category', 'type']
    );
    return successResponse(res, { query: q, count: results.length, results }, `Found ${results.length} datasets matching '${q}'`);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// GET /api/v1/search/all?q=worker  (global search)
const searchAll = (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') return errorResponse(res, 'Query param q is required', 400);

    const fields = ['title', 'name', 'displayName', 'description', 'tags', 'category', 'topic'];
    return successResponse(res, {
      query: q,
      results: {
        problems:  filterByKeyword(problems.filter(p => p.isActive), q, fields),
        topics:    filterByKeyword(topics, q, fields),
        solutions: filterByKeyword(solutions, q, fields),
        datasets:  filterByKeyword(datasets.filter(d => d.isActive), q, fields)
      }
    }, `Global search results for '${q}'`);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

module.exports = { searchProblems, searchTopics, searchSolutions, searchDatasets, searchAll };
