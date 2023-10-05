const routers = require('express').Router();

const { errors } = require('celebrate');
const { login, createUser, exitProfile } = require('../controllers/users');
const { validationAuth, validationRegister } = require('../utils/validation-joi');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');

routers.use('/movies', auth, require('./movies'));
routers.use('/users', auth, require('./users'));

routers.post('/signin', validationAuth, login);
routers.post('/signup', validationRegister, createUser);
routers.post('/signout', exitProfile);
routers.use('*', auth, () => {
  throw new NotFoundError('Неправильный путь');
});

routers.use(errors());

module.exports = routers;
