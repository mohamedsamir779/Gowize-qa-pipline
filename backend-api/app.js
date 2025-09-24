const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const http = require('http');
const i18n = require('i18n');

require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

const { dbMysql } = require('src/common/lib');

const { apiErrorHandler, parseRoutes } = require('./src/common/handlers');
const { keys } = require('./src/common/data');

if (keys.enableFX) {
  require('src/rmq-listener')(true);
  dbMysql.sequelize.sync().then(() => {
    // eslint-disable-next-line no-console
    console.log('Drop and re-sync db.');
  });
}

const cpRouter = require('./src/cp.router');
const crmRouter = require('./src/crm.router');
const defaultRouter = require('./src/default.router');
const { sockets: SocketIO, logger } = require('./src/common/lib');
const Startup = require('./startup');

const app = express();

/**
 * locales
 */
i18n.configure({
  locales: ['en', 'ar', 'gr', 'it', 'rs', 'sp'],
  cookie: 'yourcookiename',
  directory: `${__dirname}/locales`,
});
app.set('trust proxy', true);
app.use(i18n.init);
app.locals.translateLanguage = require('./src/common/handlers/translator');

// view engine setup
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'uploads')));

app.use(cors());
require('src/common/lib/agenda');

app.use('/api/v1/cp', cpRouter);
app.use('/api/v1/crm', crmRouter);
app.use('/', defaultRouter);

if (keys.currentEnvironment === 'dev' || keys.currentEnvironment === 'staging') {
  parseRoutes(app);
}

// if (keys.currentEnvironment !== 'dev') {
//   Startup();
// }

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

app.use(apiErrorHandler);

app.set('port', keys.port);
app.set('trust proxy', true);

const server = http.createServer(app);
SocketIO.connect(server, express.Router());

const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? `Pipe ${keys.port}`
    : `Port ${keys.port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`;
  logger.info(`Listenign on ${bind}`);
};

server.listen(keys.port);
server.on('error', onError);
server.on('listening', onListening);

module.exports = server;
