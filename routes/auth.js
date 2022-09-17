const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const { createUser, login, logout } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.post('/signup', celebrate({
  body: {
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  },
}), createUser);
router.post('/signin', celebrate({
  body: {
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  },
}), login);
router.post('/signout', auth, logout);

module.exports = router;
