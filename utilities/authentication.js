const jwt = require('jsonwebtoken');
const User = require('../schema/user');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if(err) return res.sendStatus(403);
        try {
            const result = await User.findById(user.id);
            req.user = result;
            next();
        } catch(e) {
            res.sendStatus(400);
        }
    });
};

module.exports = authenticateToken;