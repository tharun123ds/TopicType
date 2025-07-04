const express = require('express');
const router = express.Router();
const { signup, login, logout } = require('../controllers/authController');
const { validateSignup, validateLogin } = require('../middleware/validationMiddleware'); // Create this.
const rateLimiter = require('../middleware/rateLimiter');
const { refreshTokenController } = require('../controllers/tokenController');
const { forgotPassword, resetPassword } = require('../controllers/passwordController');
const authMiddleware = require('../middleware/authMiddleware');
const { changeUsername } = require('../controllers/usernameController');


router.post('/refresh-token', refreshTokenController);
router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, rateLimiter, login);
router.post('/forgot-password', rateLimiter, forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/logout', logout);
router.patch('/change-username', authMiddleware, changeUsername);

module.exports = router;
