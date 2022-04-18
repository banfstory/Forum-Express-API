const express = require('express');
const Joi = require('joi');
const overwriteTable = require('../utilities/patchVar');
const Post = require('../schema/post');
const setQueryByIdListener = require('../utilities/setQueryByIdListener');
const router = express.Router();
const authentication = require('../utilities/authentication');
const createPayload = require('../utilities/createPayload');

setQueryByIdListener(Post, router);

router.route('/')
.get(async (req, res) => {
    try {
        const limit = req.query.limit;
        const { userId, forumId } = req.query;
        let payload = { userId, forumId };
        payload = createPayload(payload);
        const post = await Post.find(payload).limit(limit ? limit : 0);
        res.send(post);
    } catch(e) {
        res.send([]);
    }
})
.post(authentication, async (req, res) => {
    try {
        const { title, content, forumId } = req.body;
        const userId = req.user.id;
        const payload = { title, content, userId, forumId };
        const schema = Joi.object().keys({
            title: Joi.string().trim().required(),
            content: Joi.string().trim(),
            userId: Joi.string().required(),
            forumId: Joi.string().required()
        });
        const result = schema.validate(payload);
        if(result.error) {
            res.status(400).send(result.error.details[0].message);
            return;
        }

        const post = await Post.create(payload);
        await post.save();
        res.send(post);
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
        const { title, content, forumId } = req.body;
        const userId = req.user.id;
        const payload = { title, content, userId, forumId };
        const schema = Joi.object().keys({
            title: Joi.string(),
            content: Joi.string(),
            userId: Joi.string(),
            forumId: Joi.string()
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