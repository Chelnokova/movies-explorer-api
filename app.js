const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/error-handler');
const routers = require('./routes');
const limiter = require('./utils/limiter');

const { PORT = 4000, DB_ADDRESS = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

const app = express();

mongoose.connect(DB_ADDRESS, {
  useNewUrlParser: true,
})
  .then(() => {
    console.log('Успешно');
  })
  .catch((err) => {
    console.log(`Ошибка ${err}`);
  });

app.use(cors({
  origin: [
    'http://localhost:3001',
    'https://localhost:3001',
    'http://api.julia.movies.nomoredomainsrocks.ru',
    'https://api.julia.movies.nomoredomainsrocks.ru'],
}));

app.use(requestLogger);

app.use('/', express.json());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(helmet());
app.use(limiter);
app.use(routers);
app.use(errorLogger);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log('Сервер запущен');
});
