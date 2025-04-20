const express = require('express');
const passport = require('passport');
const router = express.Router();
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');

// Cookie config for refresh token
const refreshCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/auth/refresh-token',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// Step 1: Trigger Google OAuth login
router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
    })
);

// Step 2: Callback from Google
router.get(
    '/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login-failure' }),
    async (req, res) => {
        try {
            const user = req.user;

            const payload = {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            };

            const accessToken = generateAccessToken(payload);
            const refreshToken = generateRefreshToken(payload);


            // Set refresh token cookie
            res.cookie('refreshToken', refreshToken, refreshCookieOptions);

            // Redirect to your frontend with access token
            const redirectURL = `${process.env.CLIENT_URL}/oauth-success?accessToken=${accessToken}`;
            return res.redirect(redirectURL);
        } catch (error) {
            console.error('OAuth callback error:', error);
            res.redirect(`${process.env.CLIENT_URL}/oauth-error`);
        }
    }
);

module.exports = router;
