/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const { errors } = require('celebrate');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const corsOption = require('./utils/corsOption');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError');
const errHandler = require('./middlewares/errHandler');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const apiLimiter = require('./utils/rateLimitOpt');

const { PORT = 3000 } = process.env;
const app = express();

const { mongoDbAddress } = require('./utils/constant');

mongoose.connect(mongoDbAddress, {
  useNewUrlParser: true,
});
app.use(cors(corsOption));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger);

app.use(require('./routes/authRoutes'));

app.use(auth);
app.use(require('./routes/movies'));

app.use(require('./routes/users'));

app.use('/*', (req, res, next) => {
  next(new NotFoundError('Страница по указанному URL не найдена'));
});
app.use(errorLogger);
app.use(errors());
app.use(apiLimiter);
app.use(errHandler);
app.listen(PORT, () => {
  console.log(`Port:${PORT}`);
});
