/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const { celebrate, Joi, errors } = require('celebrate');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const corsOption = require('./utils/corsOption');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError');
const errHandler = require('./middlewares/errHandler');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
});
app.use(cors(corsOption));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger);

app.post(
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
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  login,
);
app.get('/signout', (_, res) => {
  res.status(200).clearCookie('jwt').send({ message: 'Выход' });
});
app.use(auth);
app.use(moviesRouter);
app.use(usersRouter);

app.use('/*', (req, res, next) => {
  next(new NotFoundError('Страница по указанному URL не найдена'));
});
app.use(errorLogger);
app.use(errors());

app.use(errHandler);
app.listen(PORT, () => {
  console.log(`Port:${PORT}`);
});
