const express = require('express');
const Joi = require('joi');
const Comment = require('../schema/comment');
const overwriteTable = require('../utilities/patchVar');
const setQueryByIdListener = require('../utilities/setQueryByIdListener');
const router = express.Router();
const authentication = require('../utilities/authentication');
const createPayload = require('../utilities/createPayload');

setQueryByIdListener(Comment, router);

router.route('/')
.get(async (req, res) => {
    try {
        const limit = req.query.limit;
        const { userId, postId } = req.query;
        let payload = { userId, postId };
        payload = createPayload(payload);
        const comment = await Comment.find(payload).limit(limit ? limit : 0);
        res.send(comment);
    } catch(e) {
        res.send([]);
    }
})
.post(authentication, async (req, res) => {
    try {
        const { content, postId } = req.body;
        const userId = req.user.id;
        const payload = { content, userId, postId };
        const schema = Joi.object().keys({
            content: Joi.string().trim().required(),
            userId: Joi.string().trim().required(),
            postId: Joi.string().trim().required()
        });
        const result = schema.validate(payload);
        if(result.message) {
            res.status(400).send(result.error.details[0].message);
            return;
        }
        const comment = await Comment.create(payload);
        await comment.save();
        res.send(comment);
    } catch(e) {
        res.send(e.message);
    }
});

router.route('/:id')
.get(async (req, res) => {
    try {
        res.send(req.result);
    } catch(e) {
        res.send(e.message);
    }
})
.patch(authentication, async (req, res) => {
    try {
        if(req.result.userId != req.user.id) {
            return res.sendStatus(401);
        }
        const { content, postId } = req.body;
        const  userId = req.user.id;
        const payload = { content, userId, postId };
        const schema = Joi.object().keys({
            content: Joi.string(),
            userId: Joi.string(),
            postId: Joi.string()
        });
        const result = schema.validate(payload);
        if(result.error) {
            res.status(400).send(result.error.details[0].message);
            return;
        }
        overwriteTable(req.result, payload);
        await req.result.save();
        res.send(req.result);
    } catch(e) {
        res.send(e.message);
    }
})
.delete(authentication, async (req, res) => {
    try {
        if(req.result.userId != req.user.id) {
            return res.sendStatus(401);
        }
        await req.result.deleteOne();
        res.send(req.result);
    } catch(e) {
        res.send(e.message);
    }
});

module.exports = router;