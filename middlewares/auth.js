const jwt = require('jsonwebtoken');
const { HTTP401Error } = require('../utils/errors');

const { NODE_ENV, JWT_SECRET } = process.env;

/**
 * а вот здесь мб стоит написать про то что я реализую все через 401 намерено
 * не разбиваю ситуации когда пользователь не найден и когда с токеном что-то не так
 */
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
