const jwt = require('jsonwebtoken');
const DeniedAccessError = require('../utils/denied-access-error');

const extractJwtToken = (header) => header.replace('jwt=', '');

module.exports = (req, res, next) => {
  const { cookie } = req.headers;
  if (!cookie || !cookie.startsWith('jwt=')) {
    next(new DeniedAccessError('Необходима авторизация'));
  }

  const token = extractJwtToken(cookie);

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
