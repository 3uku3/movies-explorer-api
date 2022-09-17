const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  setUser,
  getMe,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

router.get('/users/me', auth, getMe);
router.patch('/users/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email({ tlds: { allow: false } }),
  }),
}), setUser);

module.exports = router;
