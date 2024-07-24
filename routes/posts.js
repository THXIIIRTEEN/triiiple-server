
const postRouter = require('express').Router();

const newComment = require('../middlewares/post').newComment;
const postNewComment = require('../middlewares/post').postNewComment;
const deleteComment = require('../middlewares/post').deleteComment;

const getPostById = require('../middlewares/post').getPostById;

const getAllPosts = require("../middlewares/post").getAllPosts;
const setLike = require("../middlewares/post").setLike;
const removeLike = require("../middlewares/post").removeLike;
const newLike = require("../middlewares/post").newLike;

const getNewPostData = require("../middlewares/post").getNewPostData;
const createNewPost = require("../middlewares/post").createNewPost;
const createPostPicture = require("../middlewares/post").createPostPicture;
const updatePostImagePath = require("../middlewares/post").updatePostImagePath;

const getAllPostsOfUser = require("../middlewares/post").getAllPostsOfUser;

const deletePost = require("../middlewares/post").deletePost;

const sendAllPosts = require("../controllers/post").sendAllPosts;

postRouter.get("/post", getAllPosts, sendAllPosts);
postRouter.post("/post/like", setLike);
postRouter.delete("/post/like", removeLike);

postRouter.post("/post/like/new", newLike);

postRouter.post("/post/comment", newComment, postNewComment);
postRouter.delete("/post/comment", deleteComment);

postRouter.post("/post/getById", getPostById);

postRouter.post("/post/newPost", getNewPostData, createNewPost, createPostPicture, updatePostImagePath);

postRouter.post("/post/getAllPostsOfUser", getAllPostsOfUser);
postRouter.delete("/post", deletePost);


module.exports = postRouter;