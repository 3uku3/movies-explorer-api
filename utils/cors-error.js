const { FORBIDDEN_STATUS } = require('./status');

class CorsError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = FORBIDDEN_STATUS;
  }
}

module.exports = CorsError;
