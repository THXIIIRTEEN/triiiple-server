const login = require('../middlewares/auth').login;
const registration = require('../middlewares/auth').registration;
const jwtCheck = require('../middlewares/auth').jwtCheck;
const findUserById = require('../middlewares/auth').findUserById;
const getUserDataByUsername = require('../middlewares/auth').getUserDataByUsername;

const authRouter = require('express').Router();

authRouter.post('/login', login);
authRouter.post('/registration', registration);
authRouter.post('/verification', jwtCheck);
authRouter.post('/userByID', findUserById);
authRouter.post('/getUser', getUserDataByUsername);

module.exports = authRouter;