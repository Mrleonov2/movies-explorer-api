const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const saveMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    nameRU,
    nameEN,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    nameRU,
    nameEN,
    movieId,
    owner: req.user._id,
  }).then((movieCard) => {
    res.send(movieCard);
  }).catch((err) => {
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
    Movie.findByIdAndRemove(req.params.movieId)
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
  Movie.findById(req.params.movieId)
    .then((movieCard) => {
      if (!movieCard) {
        return next(new NotFoundError('Карточка с указанным _id не найдена'));
      }
      if (req.user._id !== movieCard.owner.toString()) {
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

const getSavedMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movieCard) => {
      if (!movieCard) {
        return next(
          new NotFoundError('Сохраненне фильмы не найдены'),
        );
      }
      return res.send(movieCard);
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
  deleteMovie,
  saveMovie,
};
