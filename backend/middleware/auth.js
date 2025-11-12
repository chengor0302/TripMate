const jwt = require('jsonwebtoken');
const { eventNames } = require('../models/Trip');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if(!authHeader) return res.status(401).json({error: 'No token provided'});
    const token = authHeader.split(' ')[1];
    if(!token) return res.status(401).json({error: 'Token malformed'});
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {id: decoded.id};
        next();
    } catch (err){
        res.status(401).json({error: 'Token invalid'});
    }
}

module.exports = authMiddleware;