require("dotenv").config()
const express = require('express');
const router = express.Router();
const User = require('../schema/user');
const RefreshToken = require('../schema/refreshToken');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

router.post('/login', async (req, res) => {
    try {
        let { username, password } = req.body;
        const user = await User.findOne({ username: username });
        if(!bcrypt.compareSync(password, user.password)) {
            return res.sendStatus(403);
        }
        const id = { id: user.id };
        const accessToken = generateAccessToken(id);
        const refreshToken = jwt.sign(id, process.env.REFRESH_TOKEN_SECRET);
        token_db = await RefreshToken.create({ 'token': refreshToken });
        token_db.save();
        res.json({ accessToken: accessToken, refreshToken: refreshToken });
    } catch(e) {
        res.sendStatus(400);
    }
});

router.post('/token', async (req, res) => {
    try {
        const refreshToken = req.body.token;
        if(refreshToken == null) return res.sendStatus(401);
        token_db = await RefreshToken.findOne({ token: refreshToken });
        if(!token_db) return res.sendStatus(403);
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if(err) return res.sendStatus(403);
            const id = { id: user.id };
            const accessToken = generateAccessToken(id);
            res.json({ accessToken: accessToken });
        });
    } catch(e) {
        res.sendStatus(400);
    }
});

router.delete('/logout', async (req, res) => {
    const refreshToken = req.body.token;
    if(refreshToken == null) return res.sendStatus(401);
    token_db = await RefreshToken.findOne({ token: refreshToken });
    if(!token_db) return res.sendStatus(403);
    token_db.delete();
    res.sendStatus(204);
});

function generateAccessToken(id) {
    return jwt.sign(id, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });
}

module.exports = router;