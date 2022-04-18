const express = require('express');
const Joi = require('joi');
const overwriteTable = require('../utilities/patchVar');
const router = express.Router();
const setQueryByIdListener = require('../utilities/setQueryByIdListener');
const Forum = require('../schema/forum');
const uploadImage = require('../utilities/uploadImage');
const upload = uploadImage('./assets/forums');
const authentication = require('../utilities/authentication');
const createPayload = require('../utilities/createPayload');

setQueryByIdListener(Forum, router);

router.route('/')
.get(async (req, res) => {
    try {
        const limit = req.query.limit;
        const { ownerId } = req.query;
        let payload = { ownerId };
        payload = createPayload(payload);
        const forum = await Forum.find(payload).limit(limit ? limit : 0);
        res.json(forum);
    } catch(e) {
        res.send([]);
    }
})
.post(authentication, async (req, res) => {
    try {
        const { name, about } = req.body;
        const ownerId = req.user.id;
        const payload = { name, about, ownerId };
        const schema = Joi.object().keys({
            name: Joi.string().trim().required(),
            about: Joi.string().trim().required(),
            ownerId: Joi.string().trim().required()
        });
        const result = schema.validate(payload);
        if(result.error) {
            res.status(400).send(result.error.details[0].message);
            return;
        }

        const forum = await Forum.create(payload);
        forum.save()
        res.send(forum);
    } catch(e) {
        res.json(e.message);
    }
});

router.route('/:id')
.get(async (req, res) => {
    try {
        res.json(req.result);
    } catch(e) {
        res.json(e.message);
    }
})
.patch(authentication, async (req, res) => {
    try {
        if(req.result.ownerId != req.user.id) {
            return res.sendStatus(401);
        }
        const { name, about } = req.body;
        const ownerId = req.user.id;
        const payload = { name, about, ownerId };

        const schema = Joi.object().keys({
            name: Joi.string().trim(),
            about: Joi.string().trim(),
            ownerId: Joi.string().trim(),
        });
        const result = schema.validate(payload);
        
        if(result.error) {
            res.status(400).send(result.error.details[0].message);
            return;          
        }
        overwriteTable(req.result, payload);
        await req.result.save();
        res.json(req.result);
    } catch(e) {
        res.send(e.message);
    }
})
.delete(authentication, async (req, res) => {
    try {
        if(req.result.ownerId != req.user.id) {
            return res.sendStatus(401);
        }
        await req.result.deleteOne();
        res.json(req.result);
    } catch(e) {
        res.json(e.message);
    }
});

router.route('/image/:id')
.post(authentication, upload.single('userImage'), async (req, res) => {
    try {
        if(req.result.ownerId != req.user.id) {
            return res.sendStatus(401);
        }
        if(!req.file) {
            return res.status(400).json({ 'message': 'file must be a .png or .jpeg' })
        }
        req.result.displayPicture = req.file.path;
        req.result.save();
        res.json({ 'message': 'forum image has been updated' });
    } catch(e) {
        res.json(e.message);
    }
})
.delete(authentication, async (req, res) => {
    try {
        if(req.result.ownerId != req.user.id) {
            return res.sendStatus(401);
        }
        req.result.displayPicture = undefined;
        req.result.save();
        res.json({ 'message': 'forum image has been removed' })
    } catch(e) {
        res.json(e.message);
    }
});

module.exports = router;