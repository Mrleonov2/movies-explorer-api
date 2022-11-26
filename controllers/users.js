const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');

const saltRounds = 10;
const MONGO_DUPLICATE_KEY_CODE = 11000;
const { NODE_ENV, JWT_SECRET } = process.env;
const { JWT_DEV } = require('../utils/constant');

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  return bcrypt
    .hash(password, saltRounds)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }).then((user) => {
      res.send({
        name: user.name,
        email,
      });
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(
          new BadRequestError(
            'Переданы некорректные данные при создании пользователя',
          ),
        );
      }
      if (err.code === MONGO_DUPLICATE_KEY_CODE) {
        return next(
          new ConflictError('Пользователь с таким email уже существует'),
        );
      }
      return next(err);
    });
};
const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(
    id,
    { name, email },
    { new: true, runValidators: true },
  ).then((user) => {
    if (!user) {
      return next(
        new NotFoundError('Пользователь с указанным _id не найден'),
      );
    }
    return res.send(user);
  })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(
          new BadRequestError(
            'Переданы некорректные данные при обновлении профиля',
          ),
        );
      }
      if (err.code === MONGO_DUPLICATE_KEY_CODE) {
        return next(
          new ConflictError('Данный email уже занят'),
        );
      }
      return next(err);
    });
};
const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : JWT_DEV, {
        expiresIn: '7d',
      });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        // httpOnly: true,
        // sameSite: 'none',
        secure: true,
      });
      res.send({ token });
    })
    .catch(next);
};
const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(
          new NotFoundError('Пользователь с указанным _id не найден'),
        );
      }
      return res.send(user);
    })
    .catch((err) => next(err));
};
module.exports = {
  createUser,
  updateUser,
  login,
  getCurrentUser,
};
