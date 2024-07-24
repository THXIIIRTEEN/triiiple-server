const user = require('../database/schemes/user');
const bcrypt = require("bcryptjs");
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const jwt = require("jsonwebtoken");

const serverURL = "http://localhost:3001";

const upload = multer({ dest: "images/" });

const findAllUsers = async (req, res, next) => {
    req.userArray = await user.find({});
    next();
};

const getData = async (req, res, next) => {
  upload.single('profile')(req, res, function (err) {
    res.locals.userData = JSON.parse(req.body.userData);
  next();
});
};

const hashPassword = async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(res.locals.userData.password, salt);
    res.locals.userData.password = hash;
    next();
  } catch (error) {
    res.status(400).send({ message: "Ошибка хеширования пароля" });
  }
}; 

const createUserProfile = async (req, res, next) => {
  const upload = multer({ dest: `images/${res.locals.userData.username}/profile/` });

    upload.single('profile')(req, res, function (err) {
      const file = req.file;
      const extnameFile = path.extname(file.originalname);
      const newPath = path.join(__dirname, '..', 'images', `${res.locals.userData.username}`, 'profile', `profile${extnameFile}`);
      fs.renameSync(file.path, newPath);
      res.locals.userData.profile = `${serverURL}/images/${res.locals.userData.username}/profile/profile${extnameFile}`
      next();
  });
}

const createUser = async (req, res, next) => {
    try {
      console.log(res.locals.userData)
      req.user = await user.create(res.locals.userData);
      next();
    } catch (error) {
        res.setHeader("Content-Type", "application/json");
        res.status(400).send(JSON.stringify({ message: "Ошибка создания пользователя" }));
    }
};



module.exports = {
    findAllUsers: findAllUsers,
    createUser: createUser,
    hashPassword: hashPassword,
    createUserProfile: createUserProfile,
    getData: getData,
};
