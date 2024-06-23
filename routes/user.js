const userRouter = require('express').Router();

const sendAllUser = require('../controllers/user').sendAllUser;
const sendUserCreated = require('../controllers/user').sendUserCreated;

const findAllUsers = require('../middlewares/user').findAllUsers;
const createUser = require('../middlewares/user').createUser;
const hashPassword = require('../middlewares/user').hashPassword;

userRouter.get('/user', findAllUsers, sendAllUser);

userRouter.post('/user', findAllUsers, hashPassword, createUser, sendUserCreated)

module.exports = userRouter