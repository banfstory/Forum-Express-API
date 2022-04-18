const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    datePosted: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
    content: String,
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    },
    forumId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'Forum'
    }
});

module.exports = mongoose.model('Post', postSchema);