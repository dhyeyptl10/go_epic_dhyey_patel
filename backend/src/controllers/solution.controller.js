// ============================================
// SOLUTION CONTROLLER – Go-Epic Backend
// Full CRUD + filtering by problemId
// ============================================

const { successResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');
const { paginate, sortArray, filterByKeyword }               = require('../utils/helpers');

let solutions = require('../data/solutions.data');

// GET /api/v1/solutions
const getAllSolutions = (req, res) => {
  try {
    let result = [...solutions];
    const { problemId, difficulty, language, keyword, sort, page = 1, limit = 10 } = req.query;

    if (problemId)  result = result.filter(s => s.problemId === problemId);
    if (difficulty) result = result.filter(s => s.difficulty === difficulty);
    if (language)   result = result.filter(s => s.language === language);
    if (keyword)    result = filterByKeyword(result, keyword, ['title', 'approach', 'explanation', 'problemTitle']);
    if (sort)       result = sortArray(result, sort);

    const total    = result.length;
    const paginated = paginate(result, parseInt(page), parseInt(limit));

    return paginatedResponse(res, paginated, page, limit, total, 'Solutions fetched successfully');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// GET /api/v1/solutions/:solutionId
const getSolutionById = (req, res) => {
  try {
    const solution = solutions.find(s => s.id === req.params.solutionId);
    if (!solution) return errorResponse(res, `Solution '${req.params.solutionId}' not found`, 404);
    return successResponse(res, solution, 'Solution fetched successfully');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// POST /api/v1/solutions
const createSolution = (req, res) => {
  try {
    const { problemId, problemTitle, title, approach, timeComplexity, spaceComplexity, difficulty, language, code, explanation } = req.body;
    if (!problemId || !title || !code) {
      return errorResponse(res, 'problemId, title, and code are required', 400);
    }
    const newSolution = {
      id:             `sol_${Date.now()}`,
      problemId,
      problemTitle:   problemTitle || '',
      title:          title.trim(),
      approach:       approach || '',
      timeComplexity: timeComplexity || 'N/A',
      spaceComplexity: spaceComplexity || 'N/A',
      difficulty:     difficulty || 'medium',
      language:       language   || 'javascript',
      code,
      explanation:    explanation || '',
      isOptimal:      false,
      votes:          0,
      createdAt:      new Date().toISOString()
    };
    solutions.push(newSolution);
    return successResponse(res, newSolution, 'Solution created successfully', 201);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// PUT /api/v1/solutions/:solutionId
const replaceSolution = (req, res) => {
  try {
    const index = solutions.findIndex(s => s.id === req.params.solutionId);
    if (index === -1) return errorResponse(res, 'Solution not found', 404);
    solutions[index] = { ...solutions[index], ...req.body, updatedAt: new Date().toISOString() };
    return successResponse(res, solutions[index], 'Solution replaced successfully');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// PATCH /api/v1/solutions/:solutionId
const updateSolution = (req, res) => {
  try {
    const index = solutions.findIndex(s => s.id === req.params.solutionId);
    if (index === -1) return errorResponse(res, 'Solution not found', 404);
    solutions[index] = { ...solutions[index], ...req.body, updatedAt: new Date().toISOString() };
    return successResponse(res, solutions[index], 'Solution updated successfully');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// DELETE /api/v1/solutions/:solutionId
const deleteSolution = (req, res) => {
  try {
    const index = solutions.findIndex(s => s.id === req.params.solutionId);
    if (index === -1) return errorResponse(res, 'Solution not found', 404);
    solutions.splice(index, 1);
    return successResponse(res, null, 'Solution deleted successfully');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

module.exports = { getAllSolutions, getSolutionById, createSolution, replaceSolution, updateSolution, deleteSolution };
