import winston from 'winston';

interface ConsoleTransportOptions {
  level: string;
  handleExceptions: boolean;
  json: boolean;
  colorize: boolean;
}

interface LoggerOptions {
  console: ConsoleTransportOptions;
}

const options: LoggerOptions = {
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(options.console),
  ],
  exitOnError: false,
});

export default logger;
