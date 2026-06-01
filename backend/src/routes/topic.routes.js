// ============================================
// TOPIC ROUTES – Go-Epic Backend
// ============================================

const express = require('express');
const router  = express.Router();

const {
  getAllTopics,
  getPopularTopics,
  getTopicByName,
  createTopic,
  replaceTopic,
  updateTopic,
  deleteTopic
} = require('../controllers/topic.controller');

const { validateTopic } = require('../middleware/validation.middleware');
const authMiddleware     = require('../middleware/auth.middleware');
const adminMiddleware    = require('../middleware/admin.middleware');

// Public routes
router.get('/',               getAllTopics);     // GET /api/v1/topics
router.get('/popular',        getPopularTopics); // GET /api/v1/topics/popular
router.get('/:topicName',     getTopicByName);   // GET /api/v1/topics/:topicName

// Protected routes (admin only)
router.post('/',                authMiddleware, adminMiddleware, validateTopic, createTopic);  // POST
router.put('/:topicName',       authMiddleware, adminMiddleware, validateTopic, replaceTopic); // PUT
router.patch('/:topicName',     authMiddleware, adminMiddleware, updateTopic);                  // PATCH
router.delete('/:topicName',    authMiddleware, adminMiddleware, deleteTopic);                  // DELETE

module.exports = router;
