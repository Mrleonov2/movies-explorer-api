const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getSavedMovies,
  getCurrentUser,
  deleteMovie,
  updateUser,
  saveMovie,
} = require('../controllers/controllers');

router.get('/users/me', getCurrentUser);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().min(2),
  }),
}), updateUser);
router.get('/movies', getSavedMovies);
router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().min(2).max(30),
    director: Joi.string().min(2),
    duration: Joi.number(),
    year: Joi.string(),
    description: Joi.string().min(2).max(30),
    image: Joi.string().min(2),
    trailer: Joi.string().min(2),
    nameRU: Joi.string().min(2),
    nameEN: Joi.string().min(2),
    thumbnail: Joi.string().min(2),
  }),
}), saveMovie);
router.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(30),
  }),
}), deleteMovie);
module.exports = router;
