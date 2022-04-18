const mongoose = require('mongoose');

const followerSchema = new mongoose.Schema({
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

module.exports = mongoose.model('Follower', followerSchema);