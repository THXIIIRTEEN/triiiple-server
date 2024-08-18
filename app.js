const express = require('express');
const app = express(); 
const path = require('path');
const http = require('http');
const cors = require('./middlewares/cors');
const { Server } = require('socket.io');

const posts = require('./database/schemes/post')
const user = require('./database/schemes/user')
const message = require('./database/schemes/message')

const PORT = 3001;

const connectDatabase = require('./database/connect');

const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/posts');
const friendsRouter = require('./routes/friends');
const messangerRouter = require('./routes/messanger');

connectDatabase();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "https://triiiple.ru",
      methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    socket.on('update comment', async () => {
        const result = await posts.find({}).populate("author").populate("likes").populate({
        path: 'comments',
        populate: {
        path: 'author',
        model: 'user'
        }
    });
        io.emit('comment updated', result);

        return () => {
            socket.off('update comment', {});
        };
    });

    socket.on('send message', async () => {
        const result = await user.find({}).populate({
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
          }).select('chats');
        io.emit('message sent', result)

        return () => {
            socket.off('send message', {});
        };
    });

    socket.on('update friends', async () => {
        const users = await user.find({}).select('friends').select('friend_requests')
        .populate({
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
        io.emit('friens updated', users);
        return () => {
            socket.off('update friends', {});
        };
    });

    socket.on('message isRead', async (id) => {
        const result = await message.findByIdAndUpdate(id, { isRead: true }).select('isRead');
        const chats = await user.find({}).populate({
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
          }).select('chats');
          io.emit('isRead updated', chats);
        return () => {
            socket.off('message isRead', {});
        };
    });

    socket.on('send notification', async (data) => {
        io.emit('notification sent', data);
        return () => {
            socket.off('send notification', {});
        };
    })
});

app.use('/images', express.static(path.join(__dirname, 'images')))

app.use(
    cors,
    express.json(),
    userRouter,
    authRouter,
    postRouter,
    friendsRouter,
    messangerRouter
);

app.get('/', (req, res) => {
    res.status(200).send('<h1>Knock knock</h1>')
    res.status(404).send('<h1>Страница не найдена</h1>');
});

server.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
});

