// eslint-disable-next-line max-classes-per-file
const HttpStatusCode = require('./HttpStatusCode');

/**
 * Описываю здесь всю империю ошибок разом чтобы удобно было читать
 */
class HTTP401Error extends Error {
  constructor(message) {
    super(message);
    this.name = 'Unauthorized';
    this.statusCode = HttpStatusCode.UNAUTHORIZED;
  }
}

class HTTP403Error extends Error {
  constructor(message) {
    super(message);
    this.name = 'Forbidden';
    this.statusCode = HttpStatusCode.FORBIDDEN;
  }
}

class HTTP404Error extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFound';
    this.statusCode = HttpStatusCode.NOT_FOUND;
  }
}

class HTTP409Error extends Error {
  constructor(message) {
    super(message);
    this.name = 'Conflict';
    this.statusCode = HttpStatusCode.CONFLICT;
  }
}

module.exports = {
  HTTP401Error, HTTP403Error, HTTP404Error, HTTP409Error,
};
