
const jwt = require('jsonwebtoken');


const generateToken = (payload, secret, options = {}) => {
    try {
        const finalOptions = { algorithm: 'HS256', ...options };
        return jwt.sign(payload, secret, finalOptions);
    } catch (error) {
        console.error('Error generating JWT:', error);
        throw error;
    }
};


const generateAccessToken = (userData) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error('❌ JWT_SECRET environment variable is not set!');
        return null;
    }
    return generateToken(userData, secret, { expiresIn: '15m' });
};


const generateRefreshToken = (userData) => {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) {
        console.error('❌ JWT_REFRESH_SECRET environment variable is not set!');
        return null;
    }
    return generateToken(userData, secret, { expiresIn: '7d' });
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    generateToken
};
