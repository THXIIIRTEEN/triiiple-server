const messangerRouter = require('express').Router();

const createChat = require("../middlewares/messanger").createChat;
const addChatToUser = require("../middlewares/messanger").addChatToUser;
const sendChats = require("../middlewares/messanger").sendChats;
const sendChatById = require("../middlewares/messanger").sendChatById;
const getNewMessageData = require("../middlewares/messanger").getNewMessageData;
const createNewMessage = require("../middlewares/messanger").createNewMessage;
const createMessagePicture = require("../middlewares/messanger").createMessagePicture;
const updatePostImagePath = require("../middlewares/messanger").updatePostImagePath;
const findChatByUsername = require("../middlewares/messanger").findChatByUsername;

const deleteMessage = require("../middlewares/messanger").deleteMessage;

messangerRouter.post('/messanger/create', createChat, addChatToUser);
messangerRouter.post('/messanger/getChats', sendChats);
messangerRouter.post('/messanger/getChatsById', sendChatById);
messangerRouter.post('/messanger/newMessage', getNewMessageData, createNewMessage, createMessagePicture, updatePostImagePath);
messangerRouter.post('/messanger/search', findChatByUsername);

messangerRouter.delete('/messanger', deleteMessage); 

module.exports = messangerRouter;