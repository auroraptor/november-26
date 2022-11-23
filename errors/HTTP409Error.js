const { HttpStatusCode } = require('../utils/HttpStatusCode');

class HTTP409Error extends Error {
  constructor(message) {
    super(message);
    this.name = 'Conflict';
    this.statusCode = HttpStatusCode.CONFLICT;
  }
}

module.exports = { HTTP409Error };
