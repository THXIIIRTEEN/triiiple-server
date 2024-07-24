const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'message',
    }]
});

module.exports = mongoose.model('chat', chatSchema);