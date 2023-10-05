const express = require('express');
const mongoose = require('mongoose');
const { rateLimit } = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/error-handler');
const routers = require('./routes');

const { PORT = 3000 } = process.env;

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb', {
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
    'http://julia.students.nomoredomainsrocks.ru',
    'https://julia.students.nomoredomainsrocks.ru',
    'https://api.julia.students.nomoredomainsrocks.ru'],
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
