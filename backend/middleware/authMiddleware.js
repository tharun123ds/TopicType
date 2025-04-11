const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET environment variable is not set.');
        return res.status(500).json({ message: 'Server error.' });
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization token missing or invalid.' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Invalid token format.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] }); // Explicit algorithm check.
        req.user = decoded; // You can access req.user in controllers
        next();
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: 'Token expired.' });
        } else if (err instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: 'Invalid token signature.' });
        } else {
            console.error('Authentication error:', err);
            return res.status(401).json({ message: 'Authentication failed.' });
        }
    }
};

module.exports = authMiddleware;