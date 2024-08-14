const mongoose = require('mongoose');

const DB_URL = 'mongodb://localhost:27013/triiiple';

async function connectDatabase() {
    try {
        await mongoose.connect(DB_URL);
        console.log('Успешно подключились к MongoDB')
      }
    catch (err) {
        console.log('При подключении MongoDB возникла ошибка')
        console.error(err);
    }
}

module.exports = connectDatabase;

// mongod --port 27013 --dbpath "C:\data\triiiple-db" Команда для подключения к бд в консоли