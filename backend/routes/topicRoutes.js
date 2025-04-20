const express = require('express');
const router = express.Router();
const topicCtrl = require('../controllers/topicController');
const subCtrl = require('../controllers/subtopicController');
const authMiddleware = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');

// Public Topic Endpoints
router.get('/', topicCtrl.getAllTopics);
router.get('/:id', topicCtrl.getTopic);

// Admin‑only Topic Endpoints
router.post('/', authMiddleware, isAdmin, topicCtrl.createTopic);
router.patch('/:id', authMiddleware, isAdmin, topicCtrl.updateTopic);
router.delete('/:id', authMiddleware, isAdmin, topicCtrl.deleteTopic);

// Public Subtopic Endpoints
router.get('/:topicName/subtopics', subCtrl.getSubtopics);

// Admin‑only Subtopic Endpoints
router.post('/:topicName/subtopics', authMiddleware, isAdmin, subCtrl.createSubtopic);
router.patch('/:topicName/subtopics/:subtopicId', authMiddleware, isAdmin, subCtrl.updateSubtopic);
router.delete('/:topicName/subtopics/:subtopicId', authMiddleware, isAdmin, subCtrl.deleteSubtopic);

module.exports = router;
