const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  CREATE_STATUS,
} = require('../utils/status');
const UncorrectDataError = require('../utils/uncorrect-data-error');
const NotFoundError = require('../utils/not-found-error');
const ConflictError = require('../utils/conflict-error');
const UncorrectEmailError = require('../utils/uncorrect-email-error');

module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id).then((user) => {
    if (!user) {
      throw new NotFoundError('Запрашиваемый пользователь не найден');
    }
    res.status(200).send({ data: user });
  }).catch(next);
};
module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  User.findOne({ email }).then((userFinded) => {
    if (userFinded) {
      throw new ConflictError('Пользователь уже зарегестрирован');
    }
    bcrypt.hash(password, 10).then((hash) => User.create({
      name, email, password: hash,
    }))
      .then((user) => {
        res.status(CREATE_STATUS).send({
          data: {
            email: user.email,
            name: user.name,
            _id: user._id,
          },
        });
      }).catch((err) => {
        if (err.name === 'ValidationError') {
          throw new UncorrectDataError('Переданы некорректные данные');
        }
        if (err.code === 11000) {
          throw new ConflictError('Пользователь уже зарегестрирован');
        }
        next(err);
      })
      .catch(next);
  })
    .catch(next);
};
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  const { NODE_ENV, JWT_SECRET } = process.env;
  User.findUserByCredintials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 3600000,
          httpOnly: true,
        }).send({
          data: {
            email: user.email,
            name: user.name,
            _id: user._id,
          },
        })
        .end();
    })
    .catch(next);
};
module.exports.setUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        res.send({ data: user });
        return;
      }
      throw new NotFoundError('Запрашиваемый пользователь не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new UncorrectDataError('Переданы некорректные данные');
      }
      if (err.name === 'CastError') {
        throw new UncorrectDataError('Передан некорректный id пользователя');
      }
      if (err.code === 11000) {
        throw new UncorrectEmailError('Переданный email уже используется');
      }
      next(err);
    }).catch(next);
};
module.exports.logout = (req, res) => {
  res.clearCookie('jwt').send()
    .end();
};
