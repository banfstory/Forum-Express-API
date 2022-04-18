const express = require('express');
const Joi = require('joi');
const overwriteTable = require('../utilities/patchVar');
const router = express.Router();
const setQueryByIdListener = require('../utilities/setQueryByIdListener');
const User = require('../schema/user');
const authentication = require('../utilities/authentication');
const uploadImage = require('../utilities/uploadImage');
const upload = uploadImage('./assets/users');
setQueryByIdListener(User, router);

router.route('/')
.get(async (req, res) => {
    try {
        const limit = req.query.limit;
        let user = await User.find().limit(limit ? limit : 0);
        res.json(user);
    } catch(e) {
        res.json([]);
    }
})
.post(async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const payload = { username, email, password };
        const schema = Joi.object().keys({
            username: Joi.string().trim().min(4).required(),
            email: Joi.string().trim().email().required(),
            password: Joi.string().min(4).required()
        });
        const result = schema.validate(payload);
        
        if(result.error) {
            res.status(400).send(result.error.details[0].message);
            return;
        }
        const user = await User.create(payload);
        await user.save();
        res.json(user);
    }
    catch(e) {
        res.json(e.message);
    }
    
});

router.route('/:id')
.get(async (req, res) => {
    try {
        res.json(req.result);
    }
    catch(e) {
        res.json(e.message);
    }
})
.patch(authentication, async (req, res) => {
    try {
        if(req.result.id != req.user.id) {
            return res.sendStatus(401);
        }
        const { username, email, password } = req.body;
        const payload = { username, email, password };

        const schema = Joi.object().keys({
            username: Joi.string().trim().min(4),
            email: Joi.string().trim().email(),
            password: Joi.string().min(4)
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
        res.json(e.message);
    }
})
.delete(authentication, async (req, res) => {
    try {
        if(req.result.id != req.user.id) {
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
        if(req.result.id != req.user.id) {
            return res.sendStatus(401);
        }
        if(!req.file) {
            return res.status(400).json({ 'message': 'file must be a .png or .jpeg' })
        }
        req.result.displayPicture = req.file.path;
        req.result.save();
        res.json({ 'message': 'user image has been updated' });
    } catch(e) {
        res.json(e.message);
    }
})
.delete(authentication, async (req, res) => {
    try {
        if(req.result.id != req.user.id) {
            return res.sendStatus(401);
        }
        req.result.displayPicture = undefined;
        req.result.save();
        res.json({ 'message': 'user image has been removed' })
    } catch(e) {
        res.json(e.message);
    }
});

module.exports = router;