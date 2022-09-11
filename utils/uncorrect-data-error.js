const { UNCORRECT_DATA_STATUS } = require('./status');

class UncorrectDataError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNCORRECT_DATA_STATUS;
  }
}

module.exports = UncorrectDataError;
