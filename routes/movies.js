const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const isURL = require('validator/lib/isURL');
const {
  getSavedMovies,
  deleteMovie,
  saveMovie,
} = require('../controllers/movies');

router.get('/movies', getSavedMovies);
router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(30),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom((val, helpers) => {
      if (isURL(val)) {
        return val;
      }
      return helpers.message('Поле image заполнено некоррекно');
    }),
    trailerLink: Joi.string().required().custom((val, helpers) => {
      if (isURL(val)) {
        return val;
      }
      return helpers.message('Поле image заполнено некоррекно');
    }),
    thumbnail: Joi.string().required().custom((val, helpers) => {
      if (isURL(val)) {
        return val;
      }
      return helpers.message('Поле image заполнено некоррекно');
    }),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    movieId: Joi.number().required(),
  }),
}), saveMovie);
router.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().hex().length(24),
  }),
}), deleteMovie);
module.exports = router;
