require("dotenv").config();
const mongoose = require('mongoose');

const forumSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    dateCreated: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
    about: String,
    displayPicture: {
        type: String,
        default: process.env.DEFAULT_IMAGE
    },
    ownerId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    }
});

module.exports = mongoose.model('Forum', forumSchema);