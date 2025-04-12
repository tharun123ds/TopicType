const express = require('express');
const router = express.Router();
const { signup, login, logout } = require('../controllers/authController');
const { validateSignup, validateLogin } = require('../middleware/validationMiddleware'); // Create this.
const rateLimiter = require('../middleware/rateLimiter');
const { refreshTokenController } = require('../controllers/tokenController');
const { forgotPassword, resetPassword } = require('../controllers/passwordController');



router.post('/refresh-token', refreshTokenController);
router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, rateLimiter, login);
router.post('/forgot-password', rateLimiter, forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/logout', logout);


module.exports = router;
