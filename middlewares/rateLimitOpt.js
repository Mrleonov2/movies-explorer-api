const rateLimiter = require('express-rate-limit');

const apiLimiter = rateLimiter({
  windowMs: 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: { message: 'Превышено допустимое число запросов к серверу' },
});
module.exports = apiLimiter;
