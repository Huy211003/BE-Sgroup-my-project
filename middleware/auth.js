require('dotenv').config();
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401).json({ error: 'Unauthorized', message: 'Token is missing' });;

    // tokenNew = token.replace('Bearer ', '');
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403).json({ error: 'Forbidden', message: 'Invalid token' });;
        req.user = user;
        next();
    });
}

module.exports = {
    authenticateToken
}