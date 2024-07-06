const winston = require('winston');
const appRoot = require("app-root-path");

const { createLogger, format } = winston;

const logger = createLogger({
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),

    format.json()
  ),
  transports: [
    new winston.transports.Console(),
    // new winston.transports.File({
    //   filename: `${appRoot}/logs/error.log`,
    //   level: 'error',
    //   handleExceptions: true,
    // }),
  ],
});

module.exports = logger;
