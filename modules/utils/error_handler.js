const logger = require('../../config/logger');
const sentry = require('../../config/sentry');
const response = require('./response');

module.exports = (error, req, res, next) => {
  const statusCode = error?.status || 500;
  const message = statusCode >= 500 ? 'Internal Server Error' : error.message;

  if (statusCode >= 500) {
    logger.error(error)
    sentry.captureException(error)
  }

  return response(res, statusCode, message);
};
