const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

const verifyAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.admin = decoded;
        // console.log('Admin Auth Success:', decoded.email);
        next();
    } catch (error) {
        console.error('Admin verification failed:', error.message);
        // console.log('Token:', req.headers.authorization);
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = verifyAdmin;
