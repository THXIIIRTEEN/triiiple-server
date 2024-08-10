const userRouter = require('express').Router();

const sendAllUser = require('../controllers/user').sendAllUser;
const sendUserCreated = require('../controllers/user').sendUserCreated;

const findAllUsers = require('../middlewares/user').findAllUsers;
const createUser = require('../middlewares/user').createUser;
const createUserProfile = require('../middlewares/user').createUserProfile;
const hashPassword = require('../middlewares/user').hashPassword;
const getData = require('../middlewares/user').getData;
const updateProfileGetData = require('../middlewares/user').updateProfileGetData;
const updateProfile = require('../middlewares/user').updateProfile;
const updateProfilePath = require('../middlewares/user').updateProfilePath;
const updateUsername = require('../middlewares/user').updateUsername;
const updateAboutMe = require('../middlewares/user').updateAboutMe;
const updatePassword = require('../middlewares/user').updatePassword;

userRouter.get('/user', findAllUsers, sendAllUser);

userRouter.post('/user', findAllUsers, getData, hashPassword, createUserProfile, createUser, sendUserCreated  );

userRouter.post("/user/updateProfile", updateProfileGetData, updateProfile, updateProfilePath); 

userRouter.post("/user/updateUsername", updateUsername);

userRouter.post("/user/updateAboutMe", updateAboutMe);

userRouter.post("/user/updatePassword", updatePassword);

module.exports = userRouter