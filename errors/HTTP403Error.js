const { HttpStatusCode } = require('../utils/HttpStatusCode');

class HTTP403Error extends Error {
  constructor(message) {
    super(message);
    this.name = 'Forbidden';
    this.statusCode = HttpStatusCode.FORBIDDEN;
  }
}

module.exports = { HTTP403Error };
