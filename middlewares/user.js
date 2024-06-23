const user = require('../database/schemes/user');
const bcrypt = require("bcryptjs");
const multer = require('multer');

const findAllUsers = async (req, res, next) => {
    req.userArray = await user.find({});
    next();
};

const hashPassword = async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    req.body.password = hash;

    next();
  } catch (error) {
    res.status(400).send({ message: "Ошибка хеширования пароля" });
  }
}; 

const createUser = async (req, res, next) => {
    try {
      console.log(req.body);
      req.user = await user.create(req.body);
      next();
    } catch (error) {
        res.setHeader("Content-Type", "application/json");
          res.status(400).send(JSON.stringify({ message: "Ошибка создания пользователя" }));
    }
};

module.exports = {
    findAllUsers: findAllUsers,
    createUser: createUser,
    hashPassword: hashPassword
};
