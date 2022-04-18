const express = require('express');
const Joi = require('joi');
const Follower = require('../schema/follower');
const overwriteTable = require('../utilities/patchVar');
const setQueryByIdListener = require('../utilities/setQueryByIdListener');
const router = express.Router();
const authentication = require('../utilities/authentication');
const createPayload = require('../utilities/createPayload');

setQueryByIdListener(Follower, router);

router.route('/')
.get(async (req, res) => {
    try {
        const limit = req.query.limit;
        const { userId, forumId } = req.query;
        let payload = { userId, forumId };
        payload = createPayload(payload);
        const follower = await Follower.find(payload).limit(limit ? limit : 0);
        res.send(follower);
    } catch(e) {
        res.send([]);
    }
})
.post(authentication, async (req, res) => {
    try {
       const { forumId } = req.body;
       const userId = req.user.id;
       const payload = { userId, forumId };
       const schema = Joi.object().keys({
            userId: Joi.string().trim().required(),
            forumId: Joi.string().trim().required()
       });
       const result = schema.validate(payload);
       const follower = await Follower.create(payload);
       if(result.message) {
            res.status(400).send(result.error.details[0].message);
            return;
        }
        await follower.save();
        res.send(follower);
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