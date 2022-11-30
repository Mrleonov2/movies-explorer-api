const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { emailValid } = require('../utils/constant');
const {
  getCurrentUser,
  updateUser,
} = require('../controllers/users');

router.get('/users/me', getCurrentUser);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().pattern(new RegExp(emailValid)),
  }),
}), updateUser);

module.exports = router;
