const { DENIED_ACCESS_STATUS } = require('./status');

class DeniedAccessError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = DENIED_ACCESS_STATUS;
  }
}

module.exports = DeniedAccessError;
