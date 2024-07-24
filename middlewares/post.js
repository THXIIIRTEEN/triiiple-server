const posts = require("../database/schemes/post");
const comment = require("../database/schemes/comment");
const multer = require('multer');
const user = require('../database/schemes/user');
const fs = require('fs');
const path = require('path');
const { ObjectId } = require("mongodb");
const url = require('url');
const fsExtra = require('fs-extra');

const serverURL = "http://localhost:3001";

const upload = multer({ dest: "images/" });

const getAllPosts = async (req, res, next) => {
    req.postsArray = await posts.find({}).populate("author").populate("likes").populate({
        path: 'comments',
        populate: {
          path: 'author',
          model: 'user'
        }
      });
    next();
};

const setLike = async (req, res) => {
  const id = req.body.id;
  const postID = req.body.postID;
  const result = await posts.findLikedUser(id, postID);
  if (result.likes.length === 0) {
    res.status(200).send(JSON.stringify(null));
  }
  if (result.likes.length != 0) {
    res.status(200).send(JSON.stringify(result.likes[0]));
  }
}

const removeLike = async (req, res) => {
  const id = req.body.id;
  const postID = req.body.postID
  const result = await posts.removeLike(id, postID);
  res.status(200).send(JSON.stringify(result));
}

const newLike = async (req, res) => {
  const id = req.body.id;
  const postID = req.body.postID
  const result = await posts.newLike(id, postID)
  res.status(200).send(JSON.stringify(result))
}

const newComment = async (req, res, next) => {
  const data = req.body.data;
  req.comment = await comment.create(data);
  next()
};

const postNewComment = async (req, res, next) => {
  posts.updateOne(
    { _id: req.body.postID },
    { $push: { comments: { _id: req.comment._id } } }
  )
  .then(() => {
    res.status(200).send(JSON.stringify("Комментарий отправлен успешно"))
  });
};



const deleteComment = async (req, res, next) => {
  const commentID = req.body.commentID;
  const postID = req.body.postID;
  await posts.deleteComment(commentID, postID);
  const data = await comment.deleteOne({ _id: commentID });
  res.status(200).send(JSON.stringify({data: data}))
  next();
}

const getPostById = async (req, res) => {
  const id = req.body.postID;
  const result = await posts.findById(id).populate("author").populate("likes").populate({
    path: 'comments',
    populate: {
      path: 'author',
      model: 'user'
    }
  })
  res.status(200).send(JSON.stringify(result));
}

const getNewPostData = async (req, res, next) => {
    upload.single('postPicture')(req, res, function (err) {
      res.locals.userData = JSON.parse(req.body.userData);
      res.locals.postPicture = req.body.postPicture
    next();
  })
}

const createNewPost = async (req, res, next) => {
  res.locals.username = res.locals.userData.author
  const userData = await user.findUserByUsername(res.locals.userData.author);
  const userID = userData._id;
  res.locals.userData = {
    author: userID,
    time: res.locals.userData.time,
    text: res.locals.userData.text,
    picture: null
  }
  const result = await posts.create(res.locals.userData);
  res.locals.post = result
  res.locals.postID = result._id.toString();
  console.log(res.locals.postPicture)
  if (res.locals.postPicture == undefined) {
    return next();
  }
}

const createPostPicture = async(req, res, next) => {
  const postID = res.locals.postID;
  const username = res.locals.username;
  const upload = multer({ dest: `images/${username}/posts/post_${postID}/` });
    upload.single('postPicture')(req, res, function (err) {
      const file = req.file;
      const extnameFile = path.extname(file.originalname);
      const newPath = path.join(__dirname, '..', 'images', `${username}`, 'posts', `post_${postID}`, `post${extnameFile}`);
      fs.renameSync(file.path, newPath);
      res.locals.pathToImage = `${serverURL}/images/${username}/posts/post_${postID}/post${extnameFile}`
      next(res.locals.pathToImage);
  });
}

const updatePostImagePath = async (pathToImage, req, res, next) => {
  const postId = res.locals.postID;
  const query = { _id: new ObjectId(postId) };
  const update = { $set: { picture: `${pathToImage}` } };
  const result = await posts.updateOne(query, update);
  res.status(200).send(JSON.stringify(result))
  next();
}

const getAllPostsOfUser = async (req, res) => {
  const userID = req.body.userID;
  const filter = { author: new ObjectId(userID) };
  const userPosts = await posts.find(filter).populate("author").populate("likes").populate({
    path: 'comments',
    populate: {
      path: 'author',
      model: 'user'
    }
  });
  res.status(200).send(JSON.stringify(userPosts))
}

const deletePost = async (req, res) => {
  const postID = req.body.postID;
  const filter = { _id: new ObjectId(postID) };
  const post = await posts.findOne(filter);

  const fileUrl = post.picture
  const baseDir = './public';
  const filePath = path.resolve(baseDir, url.parse(fileUrl).pathname);
  const absPath = path.dirname(filePath);
  const dirPath = path.relative('C:\\', absPath);
  fsExtra.remove(dirPath)
  const result = await posts.deleteOne(filter);
  res.status(200).send(JSON.stringify(result))
}

module.exports = {
    getAllPosts: getAllPosts,
    setLike: setLike,
    removeLike: removeLike,
    newLike: newLike,
    newComment: newComment,
    postNewComment: postNewComment,
    deleteComment: deleteComment,
    getPostById: getPostById,
    getNewPostData: getNewPostData,
    createNewPost: createNewPost,
    createPostPicture: createPostPicture,
    updatePostImagePath: updatePostImagePath,
    getAllPostsOfUser: getAllPostsOfUser,
    deletePost: deletePost
}