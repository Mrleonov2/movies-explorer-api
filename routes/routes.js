const routes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const NotFoundError = require('../errors/NotFoundError');
const { createUser, login } = require('../controllers/users');

routes.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);
routes.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  login,
);
routes.get('/signout', (_, res) => {
  res.status(200).clearCookie('jwt').send({ message: 'Выход' });
});
routes.use(auth, usersRouter);
routes.use(auth, moviesRouter);
routes.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Страница по указанному URL не найдена'));
});
module.exports = routes;
