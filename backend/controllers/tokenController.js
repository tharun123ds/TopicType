const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');

// Cookie options (same as used in authController)
const refreshCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/auth/refresh-token',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const refreshTokenController = async (req, res) => {
    const token = req.cookies.refreshToken;

    if (!token) {
        return res.status(401).json({ message: 'Refresh token missing.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

        // Optional: You can check in DB if this refresh token is valid/stored

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'User not found.' });
        }

        // Generate new access & refresh tokens
        const newAccessToken = generateAccessToken({ id: user._id, email: user.email });
        const newRefreshToken = generateRefreshToken({ id: user._id });

        // Set new refresh token in cookie
        res.cookie('refreshToken', newRefreshToken, refreshCookieOptions);

        // Send back access token only
        return res.status(200).json({ accessToken: newAccessToken });
    } catch (err) {
        console.error('Refresh token error:', err);
        return res.status(401).json({ message: 'Invalid or expired refresh token.' });
    }
};

module.exports = { refreshTokenController };
