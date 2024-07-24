const express = require('express');
const app = express(); 
const path = require('path');
const http = require('http');
const cors = require('./middlewares/cors');
const { Server } = require('socket.io');

const posts = require('./database/schemes/post')
const user = require('./database/schemes/user')

const PORT = 3001;

const connectDatabase = require('./database/connect');

const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/posts');
const friendsRouter = require('./routes/friends');

connectDatabase();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000"
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
        io.emit('comment updated', result)
    })
});

app.use('/images', express.static(path.join(__dirname, 'images')))

app.use(
    cors,
    express.json(),
    userRouter,
    authRouter,
    postRouter,
    friendsRouter
);

app.get('/', (req, res) => {
    res.status(200).send('<h1>Knock knock</h1>')
    res.status(404).send('<h1>Страница не найдена</h1>');
});

server.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
});

module.exports = { server }