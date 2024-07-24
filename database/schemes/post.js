const mongoose = require('mongoose');

const userModel = require("./user");
const commentModel = require("./comment")

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: userModel,
  },
  time: {
    type: Date,
    default: Date.now,
    required: true
  },
  picture: {
    type: String,
    required: false,
  },
  text: {
    type: String,
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: userModel,
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: commentModel,
  }]
});


postSchema.statics.findLikedUser = function(id, _id) {
  return this.findOne({_id})
  .populate({
    path: "likes",
    match: {
      _id: id,
    },
  }).select("likes")
  .then((post) => {
    if (!post) {
      return null
    }
    return post
  });
};

postSchema.statics.removeLike = async function(id, postID) {
  const likes = await this.findLikedUser(id, postID);
  const findLikes = likes.likes[0]._id
  return this.findOne({
  }).populate({
    path: "likes",
    match: {
      _id: id,
    },
  })
  .updateOne(
    { _id: postID },
    { $pull: { likes: { $in: [findLikes] } } }
  ).then((result) => {
    return(result);
  });
}

postSchema.statics.newLike = async function(id, postID) {
  return this.updateOne(
    { _id: postID },
    { $push: { likes: { _id: id } } }
  ).then((result) => {
    return(result);
  });
}

postSchema.statics.findComment = function(commentID, _id) {
  return this.findOne({_id})
  .populate({
    path: "comments",
    match: {
      _id: commentID,
    },
  }).select("comments")
  .then((post) => {
    if (!post) {
      return null
    }
    return post
  });
};

postSchema.statics.deleteComment = async function(commentID, _id) {
  const comments = await this.findComment(commentID, _id);
  const findComments = comments.comments[0]._id
  return this.findOne({
  }).populate({
    path: "comments",
    match: {
      _id: commentID,
    },
  })
  .updateOne(
    { _id: _id },
    { $pull: { comments: { $in: [findComments] } } }
  ).then((result) => {
    return(result);
  });
}

module.exports = mongoose.model('post', postSchema);