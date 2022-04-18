const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    dateReplied: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    },
    commentId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'Comment'
    }
});

module.exports = mongoose.model('Reply', replySchema);