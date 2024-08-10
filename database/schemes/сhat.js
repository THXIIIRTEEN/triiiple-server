const mongoose = require('mongoose');
const userModel = require("./user");

const chatSchema = new mongoose.Schema({
    authors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: userModel,
        required: true
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'message',
    }]
});

chatSchema.statics.findChat = function(array) {
    try {
      return this.findOne({})
      .populate({
        path: "authors",
        match: {
          _id: id
        },
        match: {
          _id: _id
        }
      })
      .then((chat) => {
        if (!chat) {
          return null
        }
        return chat
      });
    }
    catch (error) {
      console.log(error)
    }
};

module.exports = mongoose.model('chat', chatSchema);

