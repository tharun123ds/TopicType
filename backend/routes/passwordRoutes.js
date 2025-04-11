
const express = require('express');
const router = express.Router();
const { forgotPassword, resetPassword } = require('../controllers/passwordController');
const rateLimiter = require('../middleware/rateLimiter');

router.post('/forgot-password', rateLimiter, forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;