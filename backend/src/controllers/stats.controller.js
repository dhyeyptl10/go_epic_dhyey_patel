// ============================================
// STATS CONTROLLER – Go-Epic Backend
// Statistics / aggregations across all data
// ============================================

const { successResponse, errorResponse } = require('../utils/apiResponse');

const problems  = require('../data/problems.data');
const topics    = require('../data/topics.data');
const solutions = require('../data/solutions.data');
const datasets  = require('../data/datasets.data');
const { users } = require('../data/users.data');

// GET /api/v1/stats/problems
const getProblemStats = (req, res) => {
  try {
    const active = problems.filter(p => p.isActive);

    const byDifficulty = active.reduce((acc, p) => {
      acc[p.difficulty] = (acc[p.difficulty] || 0) + 1;
      return acc;
    }, {});

    const byTopic = active.reduce((acc, p) => {
      acc[p.topic] = (acc[p.topic] || 0) + 1;
      return acc;
    }, {});

    const bySource = active.reduce((acc, p) => {
      acc[p.source] = (acc[p.source] || 0) + 1;
      return acc;
    }, {});

    return successResponse(res, {
      total:        active.length,
      byDifficulty,
      byTopic,
      bySource
    }, 'Problem statistics fetched successfully');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// GET /api/v1/stats/topics
const getTopicStats = (req, res) => {
  try {
    const byDifficulty = topics.reduce((acc, t) => {
      acc[t.difficulty] = (acc[t.difficulty] || 0) + 1;
      return acc;
    }, {});

    const mostProblems = [...topics].sort((a, b) => b.problemCount - a.problemCount).slice(0, 3);
    const popular      = topics.filter(t => t.isPopular);

    return successResponse(res, {
      total:          topics.length,
      popularCount:   popular.length,
      byDifficulty,
      topByProblems:  mostProblems.map(t => ({ name: t.name, problemCount: t.problemCount }))
    }, 'Topic statistics fetched successfully');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// GET /api/v1/stats/solutions
const getSolutionStats = (req, res) => {
  try {
    const byLanguage = solutions.reduce((acc, s) => {
      acc[s.language] = (acc[s.language] || 0) + 1;
      return acc;
    }, {});

    const byDifficulty = solutions.reduce((acc, s) => {
      acc[s.difficulty] = (acc[s.difficulty] || 0) + 1;
      return acc;
    }, {});

    const topVoted = [...solutions].sort((a, b) => b.votes - a.votes).slice(0, 3);

    return successResponse(res, {
      total:         solutions.length,
      optimalCount:  solutions.filter(s => s.isOptimal).length,
      byLanguage,
      byDifficulty,
      topVoted:      topVoted.map(s => ({ id: s.id, title: s.title, votes: s.votes }))
    }, 'Solution statistics fetched successfully');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// GET /api/v1/stats/datasets
const getDatasetStats = (req, res) => {
  try {
    const active = datasets.filter(d => d.isActive);
    const byType = active.reduce((acc, d) => {
      acc[d.type] = (acc[d.type] || 0) + 1;
      return acc;
    }, {});
    const byCategory = active.reduce((acc, d) => {
      acc[d.category] = (acc[d.category] || 0) + 1;
      return acc;
    }, {});

    return successResponse(res, {
      total:      active.length,
      byType,
      byCategory,
      totalItems: active.reduce((sum, d) => sum + d.size, 0)
    }, 'Dataset statistics fetched successfully');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// GET /api/v1/stats/overview  (platform-wide overview)
const getOverallStats = (req, res) => {
  try {
    return successResponse(res, {
      platform: 'Go-Epic Backend',
      summary: {
        problems:  problems.filter(p => p.isActive).length,
        topics:    topics.length,
        solutions: solutions.length,
        datasets:  datasets.filter(d => d.isActive).length,
        users:     users.filter(u => u.isActive).length
      },
      difficulties: {
        easy:     problems.filter(p => p.difficulty === 'easy'     && p.isActive).length,
        medium:   problems.filter(p => p.difficulty === 'medium'   && p.isActive).length,
        hard:     problems.filter(p => p.difficulty === 'hard'     && p.isActive).length,
        advanced: problems.filter(p => p.difficulty === 'advanced' && p.isActive).length
      },
      topTopics: topics.filter(t => t.isPopular).map(t => t.name),
      generatedAt: new Date().toISOString()
    }, 'Platform overview fetched successfully');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

module.exports = { getProblemStats, getTopicStats, getSolutionStats, getDatasetStats, getOverallStats };
