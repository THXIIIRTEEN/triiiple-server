const user = require('../database/schemes/user');
const bcrypt = require("bcryptjs");
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const jwt = require("jsonwebtoken");
const fsExtra = require('fs-extra');
const { profile } = require('console');

const serverURL = "http://localhost:3001";

const upload = multer({ dest: "images/" });

const findAllUsers = async (req, res, next) => {
    try {
      req.userArray = await user.find({});
      next();
    }
    catch (error) {
      console.log(error)
    }
};

const getData = async (req, res, next) => {
  try {
    upload.single('profile')(req, res, function (err) {
      res.locals.userData = JSON.parse(req.body.userData);
    next();
    });
  }
  catch (error) {
    console.log(error)
  }
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
  try {
    const upload = multer({ dest: `images/${res.locals.userData.username}/profile/` });

    upload.single('profile')(req, res, function (err) {
      const file = req.file;
      if (file != undefined) {
        const extnameFile = path.extname(file.originalname);
        const newPath = path.join(__dirname, '..', 'images', `${res.locals.userData.username}`, 'profile', `profile${extnameFile}`);
        fs.renameSync(file.path, newPath);
        res.locals.userData.profile = `${serverURL}/images/${res.locals.userData.username}/profile/profile${extnameFile}`
        next();
      }

      if (file === undefined) {
        res.locals.userData.profile = null
        next();
      }
    });
  }
  catch (error) {
    console.log(error)
  }
}

const createUser = async (req, res, next) => {
  try {
    req.user = await user.create(res.locals.userData);
    next();
  } catch (error) {
      res.setHeader("Content-Type", "application/json");
      res.status(400).send(JSON.stringify({ message: "Ошибка создания пользователя" }));
  }
};

const updateProfileGetData = async (req, res, next) => {
  try {
    upload.single('profile')(req, res, function (err) {
      res.locals.userUpdateData = JSON.parse(req.body.userData);
      next();
    });
  }
  catch (error) {
    console.log(error)
  }
};

const updateProfile = async (req, res, next) => {
  try {
    await fsExtra.remove(`images/${res.locals.userUpdateData.username}/profile/`)
    const upload = multer({ dest: `images/${res.locals.userUpdateData.username}/profile/` });
      upload.single('profile')(req, res, async (err) => {
        const file = req.file;
        const extnameFile = path.extname(file.originalname);
        const newPath = path.join(__dirname, '..', 'images', `${res.locals.userUpdateData.username}`, 'profile', `profile${extnameFile}`);
        res.locals.profile = `${serverURL}/images/${res.locals.userUpdateData.username}/profile/profile${extnameFile}`
        fs.renameSync(file.path, newPath);
        next();
    });
  }
  catch (error) {
    console.log(error)
  }
}

const updateProfilePath = async (req, res, next) => {
  try {
    const id = res.locals.userUpdateData.id;
    const result = await user.updateOne({_id: id}, {$set: {profile: res.locals.profile}} )
    res.status(200).send(result)
  }
  catch (error) {
    console.log(error)
  }
}

const updateUsername = async (req, res, next) => {
  try {
    const id = req.body.id;
    const username = req.body.username
    const userArray = await user.findUserByUsername(username);

    if (userArray) {
      res.status(200).send(JSON.stringify(null))
    }

    if (!userArray) {
      const result = await user.updateOne({_id: id}, {$set: {username: username}});
      res.status(200).send(JSON.stringify(result))
    }
  }
  catch (error) {
    console.log(error)
  }
}

const updateAboutMe = async (req, res, next) => {
  try {
    const id = req.body.id;
    const about_user = req.body.about_user

    const result = await user.updateOne({_id: id}, {$set: {about_user: about_user}});
    res.status(200).send(JSON.stringify(result))
  }
  catch (error) {
    console.log(error)
  }
}

const updatePassword = async (req, res, next) => {
  try {
    const id = req.body.id;
    const password = req.body.password;
    const old_password = req.body.old_password;

    const userData = await user.findById(id);
    const salt = await bcrypt.genSalt(10);

    if (await bcrypt.compare(old_password, userData.password) === true) {
      const hash = await bcrypt.hash(password, salt);
      const result = await user.updateOne({_id: id}, {$set: {password: hash}});
      res.status(200).send(JSON.stringify(result))
    }

    if (await bcrypt.compare(old_password, userData.password) === false) {
      res.status(200).send(JSON.stringify(null))
    }
  }
  catch (error) {
    console.log(error)
  }
}

module.exports = {
    findAllUsers: findAllUsers,
    createUser: createUser,
    hashPassword: hashPassword,
    createUserProfile: createUserProfile,
    getData: getData,
    updateProfileGetData: updateProfileGetData,
    updateProfile: updateProfile,
    updateProfilePath: updateProfilePath,
    updateUsername: updateUsername,
    updateAboutMe: updateAboutMe,
    updatePassword: updatePassword
};
