const jwt = require('jsonwebtoken');
const DeniedAccessError = require('../utils/denied-access-error');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    next(new DeniedAccessError('Необходима авторизация'));
  }

  let payload;
  const { NODE_ENV, JWT_SECRET } = process.env;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new DeniedAccessError('Необходима авторизация'));
  }
  req.user = payload;

  next();
};
