const userRouter = require('express').Router();

const sendAllUser = require('../controllers/user').sendAllUser;
const sendUserCreated = require('../controllers/user').sendUserCreated;
const sendMe = require('../controllers/user').sendMe;

const findAllUsers = require('../middlewares/user').findAllUsers;
const createUser = require('../middlewares/user').createUser;
const createUserProfile = require('../middlewares/user').createUserProfile;
const hashPassword = require('../middlewares/user').hashPassword;
const getData = require('../middlewares/user').getData;

userRouter.get('/user', findAllUsers, sendAllUser);

userRouter.post('/user', findAllUsers, getData, hashPassword, createUserProfile, createUser, sendUserCreated  );

module.exports = userRouter