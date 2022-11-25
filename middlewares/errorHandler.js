const { HttpStatusCode } = require('../utils/HttpStatusCode');

module.exports = (err, req, res, next) => {
  const { statusCode = HttpStatusCode.INTERNAL_SERVER, message } = err;
  res.status(statusCode).send({ message: statusCode === HttpStatusCode.INTERNAL_SERVER ? 'Внутренняя ошибка сервера' : message });
  next();
};
