const mongoose = require('mongoose');

const userModel = require("./user");

const commentSchema = new mongoose.Schema({
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
  }
});

module.exports = mongoose.model('comment', commentSchema);