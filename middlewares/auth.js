const jwt = require('jsonwebtoken');
const { HTTP401Error } = require('../errors/HTTP401Error');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  let payload;
  try {
    const token = req.cookies.jwt;
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : '🔐');
  } catch (err) {
    next(new HTTP401Error('Необходима авторизация'));
    return;
  }
  req.user = payload;
  next();
};
