const { createLogger, format, transports } = require('winston');

const colorizer = format.colorize();

const ibWalletLogger = createLogger({
  transports: [
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
    new transports.File({
      filename: 'logs/mam-logs/mam.log',
      format: format.printf((msg) => (`${new Date().toUTCString()} - [${msg.level}] - ${typeof (msg.message) === 'string' ? msg.message : JSON.stringify(msg.message)}`)),
    }),
  ],
  exitOnError: false,
  handleExceptions: true,
});

module.exports = {
  ibWalletLogger,
};
