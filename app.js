const express = require('express');
const app = express(); 

const PORT = 3001;

const cors = require('./middlewares/cors');
const writeFile = require('./data-utils/data-utils');
const connectDatabase = require('./database/connect');

const userRouter = require('./routes/user');

connectDatabase();

app.use(
    cors,
    express.json(),
    userRouter
)

app.get('/', (req, res) => {
    res.status(200).send('<h1>Knock knock</h1>')
    res.status(404).send('<h1>Страница не найдена</h1>');
});

app.post('/', (req, res) => {
    res.status(200).send("Success!");
    const data = req.body;
    writeFile(data);
    console.log(data)
})

app.listen(PORT, () => {
    // Если всё работает, консоль покажет, какой порт приложение слушает
    console.log(`App listening on port ${PORT}`)
}) 