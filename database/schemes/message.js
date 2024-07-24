const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: userModel,
    },
    time: {
        type: Date,
        default: Date.now,
        required: true
    },
    text: {
        type: String,
        required: true,
    },
    picture: {
        type: String,
        required: false,
    }
});

module.exports = mongoose.model('message', messageSchema);