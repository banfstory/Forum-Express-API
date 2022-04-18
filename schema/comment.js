const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    dateCommented: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    },
    postId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'Forum'
    }
});

module.exports = mongoose.model('Comment', commentSchema);