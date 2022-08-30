const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const saltRounds = 10;
const MONGO_DUPLICATE_KEY_CODE = 11000;
const { NODE_ENV, JWT_SECRET } = process.env;

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
  )
    .then((user) => {
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
      return next(err);
    });
};
const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'secret-code', {
        expiresIn: '1d',
      });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 1,
        // httpOnly: true,
        // sameSite: 'none',
        // secure: true,
      });
      res.send({ token });
    })
    .catch(next);
};
const saveMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    nameRU,
    nameEN,
    movieId,
    owner: req.user._id,
  })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(
          new BadRequestError(
            'Переданы некорректные данные',
          ),
        );
      }
      return next(err);
    });
};
const deleteMovie = (req, res, next) => {
  const deleteCardHandler = () => {
    Movie.findByIdAndRemove(req.params.MovieId)
      .then(() => {
        res.send({ message: 'Удаление завершено' });
      })
      .catch((err) => {
        if (err.kind === 'ObjectId') {
          return next(new BadRequestError('Переданный _id некорректный'));
        }
        return next(err);
      });
  };
  Movie.findById(req.params.MovieId)
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка с указанным _id не найдена'));
      }
      if (req.user._id !== card.owner.toString()) {
        return next(new ForbiddenError('Нет прав на удаление'));
      }
      return deleteCardHandler();
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return next(new BadRequestError('Переданный _id некорректный'));
      }
      return next(err);
    });
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
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return next(new BadRequestError('Переданный _id некорректный'));
      }
      return next(err);
    });
};
const getSavedMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((user) => {
      if (!user) {
        return next(
          new NotFoundError('Сохраненне фильмы не найдены'),
        );
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return next(new BadRequestError('Переданный _id некорректный'));
      }
      return next(err);
    });
};
module.exports = {
  getSavedMovies,
  getCurrentUser,
  deleteMovie,
  updateUser,
  saveMovie,
  login,
  createUser,
};
