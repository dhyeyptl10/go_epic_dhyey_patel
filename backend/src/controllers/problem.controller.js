// ============================================
// PROBLEM CONTROLLER – Go-Epic Backend
// Full CRUD + query params + pagination + sort
// ============================================

const { successResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');
const { paginate, sortArray, filterByKeyword }               = require('../utils/helpers');

let problems = require('../data/problems.data');

// GET /api/v1/problems
// Supports: ?difficulty=easy&topic=arrays&source=leetcode&keyword=sum&sort=-difficulty&page=1&limit=10
const getAllProblems = (req, res) => {
  try {
    let result = [...problems].filter(p => p.isActive);

    const { difficulty, topic, source, keyword, sort, page = 1, limit = 10 } = req.query;

    if (difficulty) result = result.filter(p => p.difficulty === difficulty);
    if (topic)      result = result.filter(p => p.topic === topic);
    if (source)     result = result.filter(p => p.source === source);
    if (keyword)    result = filterByKeyword(result, keyword, ['title', 'description', 'topic', 'tags']);
    if (sort)       result = sortArray(result, sort);

    const total    = result.length;
    const paginated = paginate(result, parseInt(page), parseInt(limit));

    return paginatedResponse(res, paginated, page, limit, total, 'Problems fetched successfully');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// GET /api/v1/problems/random
const getRandomProblem = (req, res) => {
  try {
    const active = problems.filter(p => p.isActive);
    if (!active.length) return errorResponse(res, 'No problems found', 404);
    const random = active[Math.floor(Math.random() * active.length)];
    return successResponse(res, random, 'Random problem fetched successfully');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// GET /api/v1/problems/:problemId
const getProblemById = (req, res) => {
  try {
    const problem = problems.find(p => p.id === req.params.problemId && p.isActive);
    if (!problem) return errorResponse(res, `Problem with ID '${req.params.problemId}' not found`, 404);
    return successResponse(res, problem, 'Problem fetched successfully');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// POST /api/v1/problems
const createProblem = (req, res) => {
  try {
    const { title, description, difficulty, topic, source, tags, constraints, examples } = req.body;
    const newProblem = {
      id:          `prob_${Date.now()}`,
      title:       title.trim(),
      description: description.trim(),
      difficulty,
      topic:       topic.trim(),
      source:      source  || 'custom',
      tags:        tags    || [],
      constraints: constraints || '',
      examples:    examples    || [],
      isActive:    true,
      createdAt:   new Date().toISOString()
    };
    problems.push(newProblem);
    return successResponse(res, newProblem, 'Problem created successfully', 201);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// PUT /api/v1/problems/:problemId  (full replace)
const replaceProblem = (req, res) => {
  try {
    const index = problems.findIndex(p => p.id === req.params.problemId);
    if (index === -1) return errorResponse(res, 'Problem not found', 404);
    const { title, description, difficulty, topic, source, tags, constraints, examples } = req.body;
    problems[index] = {
      ...problems[index],
      title:       title.trim(),
      description: description.trim(),
      difficulty,
      topic:       topic.trim(),
      source:      source || 'custom',
      tags:        tags   || [],
      constraints: constraints || '',
      examples:    examples    || [],
      updatedAt:   new Date().toISOString()
    };
    return successResponse(res, problems[index], 'Problem replaced successfully');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// PATCH /api/v1/problems/:problemId  (partial update)
const updateProblem = (req, res) => {
  try {
    const index = problems.findIndex(p => p.id === req.params.problemId);
    if (index === -1) return errorResponse(res, 'Problem not found', 404);
    problems[index] = { ...problems[index], ...req.body, updatedAt: new Date().toISOString() };
    return successResponse(res, problems[index], 'Problem updated successfully');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// DELETE /api/v1/problems/:problemId  (soft delete)
const deleteProblem = (req, res) => {
  try {
    const index = problems.findIndex(p => p.id === req.params.problemId);
    if (index === -1) return errorResponse(res, 'Problem not found', 404);
    problems[index].isActive  = false;
    problems[index].deletedAt = new Date().toISOString();
    return successResponse(res, null, 'Problem deleted successfully');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

module.exports = {
  getAllProblems,
  getRandomProblem,
  getProblemById,
  createProblem,
  replaceProblem,
  updateProblem,
  deleteProblem
};
