const express = require('express');
const router = express.Router();
const {
    updateTypingResult,
    getTopicResults,
    getMyGlobalStats
} = require('../controllers/typingResultsController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, updateTypingResult);
router.get('/topic/:topic', authMiddleware, getTopicResults);
router.get('/global', authMiddleware, getMyGlobalStats);

module.exports = router;
