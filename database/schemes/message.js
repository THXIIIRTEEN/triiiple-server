const mongoose = require('mongoose');
const userModel = require("./user");

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
    },
    picture: {
        type: String,
        required: false,
    },
    isRead: {
        type: Boolean,
        required: false,
        default: false
    }
});

module.exports = mongoose.model('message', messageSchema);