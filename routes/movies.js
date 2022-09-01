const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getSavedMovies,
  deleteMovie,
  saveMovie,
} = require('../controllers/movies');

router.get('/movies', getSavedMovies);
router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().min(2).max(30),
    director: Joi.string(),
    duration: Joi.number(),
    year: Joi.string(),
    description: Joi.string(),
    image: Joi.string(),
    trailer: Joi.string(),
    thumbnail: Joi.string(),
    nameRU: Joi.string(),
    nameEN: Joi.string(),
    movieId: Joi.string(),
  }),
}), saveMovie);
router.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(30),
  }),
}), deleteMovie);
module.exports = router;
