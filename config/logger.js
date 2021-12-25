'use strict'

const winston = require('winston')

// define settings for each transport
const options = {
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

// instantiate a new Winston logger
const logger = new winston.createLogger({
  transports: [
    new winston.transports.Console(options.console)
  ],
  exitOnError: false, // do not exit on handled exceptions
});

module.exports = logger;