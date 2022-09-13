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
const errHandler = require('./middlewares/errHandler');
const routes = require('./routes/routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const apiLimiter = require('./middlewares/rateLimitOpt');

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
app.use(apiLimiter);
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(errHandler);
app.listen(PORT, () => {
  console.log(`Port:${PORT}`);
});
