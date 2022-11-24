const { HttpStatusCode } = require('../utils/HttpStatusCode');

class HTTP401Error extends Error {
  constructor(message) {
    super(message);
    this.name = 'Bad Request';
    this.statusCode = HttpStatusCode.UNAUTHORIZED;
  }
}

module.exports = { HTTP401Error };
