const signupUser = require('../services/signupService');
const loginUser = require('../services/loginService');

// Cookie config (for refresh token)
const refreshCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/auth/refresh-token', // Only send this cookie to refresh endpoint
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const signup = async (req, res) => {
    try {
        const { user, accessToken, refreshToken } = await signupUser(req.body);

        // Set refresh token as cookie
        res.cookie('refreshToken', refreshToken, refreshCookieOptions);

        res.status(201).json({ user, accessToken });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(err.status || 500).json({ message: err.message || 'Server error.' });
    }
};

const login = async (req, res) => {
    try {
        const { user, accessToken, refreshToken } = await loginUser(req.body);

        // Set refresh token as cookie
        res.cookie('refreshToken', refreshToken, refreshCookieOptions);

        res.status(200).json({ user, accessToken });
    } catch (err) {
        console.error('Login error:', err);
        res.status(err.status || 500).json({ message: err.message || 'Server error.' });
    }
};


// At the bottom of authController.js

const logout = (req, res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/api/auth/refresh-token',
    });
    return res.status(200).json({ message: 'Logged out successfully.' });
};

module.exports = { signup, login, logout };

