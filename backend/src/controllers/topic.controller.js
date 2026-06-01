// ============================================
// TOPIC CONTROLLER – Go-Epic Backend
// Full CRUD + query params + popular topics
// ============================================

const { successResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');
const { paginate, sortArray, filterByKeyword }               = require('../utils/helpers');

let topics = require('../data/topics.data');

// GET /api/v1/topics
const getAllTopics = (req, res) => {
  try {
    let result = [...topics];
    const { difficulty, keyword, sort, page = 1, limit = 10 } = req.query;

    if (difficulty) result = result.filter(t => t.difficulty === difficulty);
    if (keyword)    result = filterByKeyword(result, keyword, ['name', 'displayName', 'description', 'tags']);
    if (sort)       result = sortArray(result, sort);

    const total    = result.length;
    const paginated = paginate(result, parseInt(page), parseInt(limit));

    return paginatedResponse(res, paginated, page, limit, total, 'Topics fetched successfully');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// GET /api/v1/topics/popular
const getPopularTopics = (req, res) => {
  try {
    const popular = topics.filter(t => t.isPopular);
    return successResponse(res, popular, 'Popular topics fetched successfully');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// GET /api/v1/topics/:topicName
const getTopicByName = (req, res) => {
  try {
    const topic = topics.find(t => t.name === req.params.topicName.toLowerCase());
    if (!topic) return errorResponse(res, `Topic '${req.params.topicName}' not found`, 404);
    return successResponse(res, topic, 'Topic fetched successfully');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// POST /api/v1/topics
const createTopic = (req, res) => {
  try {
    const { name, displayName, description, difficulty, tags, prerequisites } = req.body;
    if (topics.find(t => t.name === name.toLowerCase())) {
      return errorResponse(res, `Topic '${name}' already exists`, 409);
    }
    const newTopic = {
      id:            `topic_${Date.now()}`,
      name:          name.toLowerCase().trim(),
      displayName:   displayName.trim(),
      description:   description.trim(),
      difficulty:    difficulty    || 'medium',
      problemCount:  0,
      tags:          tags          || [],
      isPopular:     false,
      prerequisites: prerequisites || [],
      resources:     [],
      createdAt:     new Date().toISOString()
    };
    topics.push(newTopic);
    return successResponse(res, newTopic, 'Topic created successfully', 201);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// PUT /api/v1/topics/:topicName
const replaceTopic = (req, res) => {
  try {
    const index = topics.findIndex(t => t.name === req.params.topicName.toLowerCase());
    if (index === -1) return errorResponse(res, 'Topic not found', 404);
    const { displayName, description, difficulty, tags, prerequisites } = req.body;
    topics[index] = {
      ...topics[index],
      displayName:   displayName.trim(),
      description:   description.trim(),
      difficulty:    difficulty    || 'medium',
      tags:          tags          || [],
      prerequisites: prerequisites || [],
      updatedAt:     new Date().toISOString()
    };
    return successResponse(res, topics[index], 'Topic replaced successfully');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// PATCH /api/v1/topics/:topicName
const updateTopic = (req, res) => {
  try {
    const index = topics.findIndex(t => t.name === req.params.topicName.toLowerCase());
    if (index === -1) return errorResponse(res, 'Topic not found', 404);
    topics[index] = { ...topics[index], ...req.body, updatedAt: new Date().toISOString() };
    return successResponse(res, topics[index], 'Topic updated successfully');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// DELETE /api/v1/topics/:topicName
const deleteTopic = (req, res) => {
  try {
    const index = topics.findIndex(t => t.name === req.params.topicName.toLowerCase());
    if (index === -1) return errorResponse(res, 'Topic not found', 404);
    topics.splice(index, 1);
    return successResponse(res, null, 'Topic deleted successfully');
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

module.exports = { getAllTopics, getPopularTopics, getTopicByName, createTopic, replaceTopic, updateTopic, deleteTopic };
