require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const { createUser, login, logout } = require('./controllers/users');
const error = require('./middlewares/errors');
const NotFoundError = require('./utils/not-found-error');
const CorsError = require('./utils/cors-error');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { NODE_ENV, PATH_DB } = process.env;
const { PORT = 3000 } = process.env;

const allowedCors = ['http://localhost:3000', 'http://api.3uku3d.nomoredomains.sbs', 'https://api.3uku3d.nomoredomains.sbs'];
const app = express();
mongoose.connect(NODE_ENV === 'production' ? PATH_DB : 'mongodb://localhost:27017/bitfilmsdb', {});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(cors({
  origin: (origin, callback) => {
    console.log(origin);
    if (allowedCors.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new CorsError('Не разрешено CORS'));
    }
  },
  credentials: true,
}));

app.post('/signup', celebrate({
  body: {
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  },
}), createUser);
app.post('/signin', celebrate({
  body: {
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  },
}), login);
app.post('/signout', logout);

app.use('/users', auth, require('./routes/users'));
app.use('/movies', auth, require('./routes/movies'));

app.use('/*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errorLogger);

app.use(errors());
app.use(error);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
