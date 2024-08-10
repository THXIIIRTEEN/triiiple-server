const jwt = require("jsonwebtoken");
const user = require('../database/schemes/user');

const login = async (req, res) => {
    const { username, password } = req.body;
    user
    .findUserAuth(username, password)
    .then((user) => {
        if (!user) {
            throw new Error('Неверное имя пользователя или пароль');
        }
        const token = jwt.sign({ _id: user._id }, "some-secret-key", {
        expiresIn: '30d'
        });

        return { user, token };
    })
    .then(({ user, token }) => {
        res.status(200).send({
            username: user.username,
            password: user.password,
            profile: user.profile,
            about_user: user.about_user,
            jwt: token
        })
    })
    .catch(() => {
        res.status(200).send(JSON.stringify(null));
    });
};

const registration = async (req, res) => {
    const username = req.body.username;

    user.checkUserExist(username)
    .then((result) => {
        if (!result) {
            throw new Error ("Пользователь не существует")
        }
        return result
    })
    .then((result) => {
        res.status(200).send({
            username: result.username,
        })
    })
    .catch(() => {
        res.status(200).send(JSON.stringify(null));
    });
};

const jwtCheck = async(req, res) => {
    const token = req.body.token;
    try {
        const decoded = jwt.verify(token, "some-secret-key");
        res.status(200).send(decoded)
    } catch (error) {
        console.error(error);
    }
}

const findUserById = async(req, res) => {
    const id = req.body.id;

    user.findById(id).populate({
        path: 'friend_requests',
        populate: {
          path: 'friend_requests',
        },
      })
      .populate({
        path: 'friends',
        populate: {
          path: 'friends',
        },
      })
      .populate({
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
    .then((user) => {
        if (!user) {
            throw new Error ("Пользователя не существует")
        }
        return user
    })
    .then((user) => {
        res.status(200).send(user)
    })
    .catch(() => {
        res.status(200).send(JSON.stringify(null));
    });
}

const getUserDataByUsername = async (req, res) => {
    const username = req.body.username;
    user.findUserByUsername(username)
    .then((user) => {
        if (!user) {
            throw new Error("Пользователя не существует");
        }
        return user;
    })
    .then((user) => {
        res.status(200).send(JSON.stringify(user));
    })
    .catch(() => {
        res.status(200).send(JSON.stringify(null));
    }) 
}

module.exports = {
    login: login,
    registration: registration,
    jwtCheck: jwtCheck,
    findUserById: findUserById,
    getUserDataByUsername: getUserDataByUsername
};