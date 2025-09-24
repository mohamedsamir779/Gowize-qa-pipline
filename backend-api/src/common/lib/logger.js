/* eslint-disable linebreak-style */

const { createLogger, format, transports } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const { keys } = require('../data');

const colorizer = format.colorize();

// logs for console
const allTransports = [
  new transports.Console({
    level: 'info',
    format: format.combine(
      format.json(),
      format.printf((msg) => colorizer.colorize(
        msg.level,
        `${new Date().toUTCString()} - [${msg.level}] - ${typeof (msg.message) === 'string' ? msg.message : JSON.stringify(msg.message)}`,
      )),
    ),
    handleExceptions: true,
  }),
];

if (keys.isLogDirectoryEnabled) {
  const options = {
    dirname: 'logs/api-logs',
    filename: 'application-%DATE%-combined.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    handleExceptions: true,
  };

  allTransports.push(
    new DailyRotateFile({
      ...options,
      level: 'error',
      filename: 'application-%DATE%-error.log',
    }),
  );

  allTransports.push(new DailyRotateFile(options));
}

const logger = createLogger({
  transports: allTransports,
  exitOnError: false,
  handleExceptions: true,
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write(message) {
    if (message) {
      logger.info(message.slice(0, -1));
    }
  },
};

module.exports = logger;
