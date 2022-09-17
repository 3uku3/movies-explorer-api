const { UNCORRECT_EMAIL_STATUS } = require('./status');

class UncorrectEmailError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNCORRECT_EMAIL_STATUS;
  }
}

module.exports = UncorrectEmailError;
