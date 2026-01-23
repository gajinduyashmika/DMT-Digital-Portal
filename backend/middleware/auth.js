const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

module.exports = async function (req, res, next) {
    // Get token from header
    const token = req.header('Authorization');

    // Check if not token
    if (!token) {
        console.log('Auth Middleware: No token provided');
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Verify token
        // Remove Bearer if present
        const tokenString = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;

        const decoded = jwt.verify(tokenString, JWT_SECRET);

        // Check if token version matches user version (for logout all)
        // Optimization: We could cache this or only check critical routes, but for security, we check here.
        const User = require('../models/User');
        const user = await User.findById(decoded.id).select('tokenVersion status');

        if (!user) {
            return res.status(401).json({ message: 'User verification failed' });
        }

        if (user.status === 'blocked') {
            return res.status(403).json({ message: 'Account is blocked' });
        }

        if (decoded.version !== undefined && user.tokenVersion !== undefined) {
            if (decoded.version !== user.tokenVersion) {
                return res.status(401).json({ message: 'Session expired (logged out from all devices)' });
            }
        }

        req.user = decoded;
        next();
    } catch (err) {
        console.error('Auth Middleware: Token verification failed:', err.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};
