const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');

const CREATED = 201;

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.send({ user });
    })
    .catch(next);
};

const updateUserProfile = (req, res, next) => {
  const { name, email } = req.body;

  const opts = { runValidators: true, new: true };
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    opts,
  ).then((user) => {
    if (!user) {
      throw new NotFoundError('Пользователь по указанному _id не найден.');
    }
    return res.send({ data: user });
  })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => res.status(CREATED).send({
      data: {
        name: user.name,
        email: user.email,
        about: user.about,
        _id: user._id,
      },
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует.'));
      } if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError('Неправильная почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return next(new UnauthorizedError('Неправильная почта или пароль'));
          }
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret',
            { expiresIn: '7d' },
          );
          return res.send({ token });
        });
    })
    .catch(next);
};

const exitProfile = (req, res) => {
  res.clearCookie('jwt');
  res.send({ message: 'Выход успешно выполнен.' });
};

module.exports = {
  getCurrentUser,
  createUser,
  login,
  updateUserProfile,
  exitProfile,
};
