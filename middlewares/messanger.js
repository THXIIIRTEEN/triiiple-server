const user = require("../database/schemes/user");
const chat = require("../database/schemes/сhat");
const message = require("../database/schemes/message");
const fsExtra = require('fs-extra');
const url = require('url');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { ObjectId } = require("mongodb");

const serverURL = "http://89.191.225.116";
const upload = multer({ dest: "images/" });

const createChat = async (req, res, next) => {
    try {
      const userId = req.body.userId;
      const friendId = req.body.friendId;
      const findChat = await chat.findOne({ authors: { $all: [userId, friendId]} });
      if (findChat === null) {
          const result = await chat.create({authors: [userId, friendId]})
          res.locals.chatId = result._id;
          next();
      }
      if (findChat != null) {
        res.status(200).send(JSON.stringify(findChat))
      }
    }
    catch (error) {
      console.log(error)
    }
}

const addChatToUser = async (req, res) => {
    try {
      const userId = req.body.userId;
      const friendId = req.body.friendId;
      await user.updateOne(
          { _id: userId },
          { $push: { chats: res.locals.chatId } }
      )
      await user.updateOne(
          { _id: friendId },
          { $push: { chats: res.locals.chatId } }
      )
      const findChat = await chat.findOne({ authors: { $all: [userId, friendId]} })
      res.status(200).send(JSON.stringify(findChat))
    }
    catch (error) {
      console.log(error)
    }
}

const sendChats = async (req, res) => {
    try {
      const userId = req.body.userId;
      const result = await user.findById(userId).populate({
          path: 'chats',
          populate: {
            path: 'authors'
          },
        })
        .populate({
          path: 'chats',
          populate: {
              path: 'messages',
              ref: 'messages',
              populate: {
                  path: 'author',
                  ref: 'user'
              }
          },
        })
      res.status(200).send(JSON.stringify(result))
    }
    catch (error) {
      console.log(error)
    }
}

const sendChatById = async (req, res) => {
    try {
      const chatId = req.body.chatId;
      const result = await chat.findById(chatId).populate({
          path: 'authors',
      })
      .populate({
          path: 'messages',
          populate: {
              path: 'author',
              ref: 'user'
          }
      })

      res.status(200).send(JSON.stringify(result))
    }
    catch (error) {
      console.log(error)
    }
}

const getNewMessageData = async (req, res, next) => {
    try {
      upload.single('postPicture')(req, res, function (err) {
        res.locals.userData = JSON.parse(req.body.userData);
        res.locals.postPicture = req.body.postPicture
      next();
      })
    }
    catch (error) {
      console.log(error)
    }
}

const createNewMessage = async (req, res, next) => {
  try {
    const chatId = res.locals.userData.chatId;
    res.locals.username = res.locals.userData.author
    const userData = await user.findUserByUsername(res.locals.userData.author);
    const userID = userData._id;
    res.locals.userData = {
      author: userID,
      time: res.locals.userData.time,
      text: res.locals.userData.text,
      picture: null
    }
    const result = await message.create(res.locals.userData);
    res.locals.post = result;
    res.locals.postID = result._id.toString();
    const messageToSent = await message.findById(result._id).populate("author")
    const update = await chat.updateOne(
      { _id: chatId },
      { $push: { messages: result._id } }
      )
    if (res.locals.postPicture == undefined) {
      return next();
    }
    else {
      res.status(200).send(JSON.stringify(messageToSent))
    }
  }
  catch (error) {
    console.log(error)
  }
}

const createMessagePicture = async(req, res, next) => {
  try {
    const postID = res.locals.postID;
    const username = res.locals.username;
    const upload = multer({ dest: `images/${username}/messages/message_${postID}/` });
      upload.single('postPicture')(req, res, function (err) {
        const file = req.file;
        const extnameFile = path.extname(file.originalname);
        const newPath = path.join(__dirname, '..', 'images', `${username}`, 'messages', `message_${postID}`, `message${extnameFile}`);
        fs.renameSync(file.path, newPath);
        res.locals.pathToImage = `${serverURL}/images/${username}/messages/message_${postID}/message${extnameFile}`
        next(res.locals.pathToImage);
    });
  }
  catch (error) {
    console.log(error)
  }
}

const updatePostImagePath = async (pathToImage, req, res, next) => {
  try {
    const postId = res.locals.postID;
    const query = { _id: new ObjectId(postId) };
    const update = { $set: { picture: `${pathToImage}` } };
    const result = await message.updateOne(query, update);
    res.status(200).send(JSON.stringify(result))
  }
  catch (error) {
    console.log(error)
  }
}

const deleteMessage = async (req, res) => {
    try {
      const postID = req.body.id;
      const filter = { _id: postID };
      const post = await message.findOne(filter);
    
      const fileUrl = post.picture
      if (fileUrl) {
        const baseDir = './public';
        const filePath = path.resolve(baseDir, url.parse(fileUrl).pathname);
        const absPath = path.dirname(filePath);
        const dirPath = path.relative('C:\\', absPath);
        fsExtra.remove(dirPath)
      } 
      const result = await message.deleteOne(filter);
      res.status(200).send(JSON.stringify(result))
    }
    catch (error) {
      console.log(error)
    }
}

const findChatByUsername = async (req, res) => {
    try {
      const userId = req.body.userId;
      const friendName = req.body.friendName; 
      const friend = await user.findOne({username: friendName})
      if (friend != null) {
          const sendChat = await chat.findOne({ authors: { $all: [userId, friend._id]} })
          .populate({
              path: 'authors',
          })
          .populate({
              path: 'messages',
              populate: {
                  path: 'author',
                  ref: 'user'
              }
          })
          res.status(200).send(JSON.stringify(sendChat))
      }
      if (friend == null) {
          const sendChat = null
          res.status(200).send(JSON.stringify(sendChat))
      }
    }
    catch (error) {
      console.log(error)
    }
}

module.exports = {
    createChat: createChat,
    addChatToUser: addChatToUser,
    sendChats: sendChats,
    sendChatById: sendChatById,
    getNewMessageData: getNewMessageData,
    createNewMessage: createNewMessage,
    createMessagePicture: createMessagePicture,
    updatePostImagePath: updatePostImagePath,
    deleteMessage: deleteMessage,
    findChatByUsername: findChatByUsername
}
