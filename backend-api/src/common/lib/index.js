//
const dbMongo = require('./db.mongo');
const logger = require('./logger');
const redis = require('./redis');
const sockets = require('./sockets');
const dbMysql = require('./db.mysql');
const fileLoggers = require('./file-logger');

dbMongo();

module.exports.dbMongo = dbMongo;
module.exports.logger = logger;
module.exports.ibWalletLogger = fileLoggers.ibWalletLogger;
module.exports.redis = redis;
module.exports.sockets = sockets;
module.exports.dbMysql = dbMysql;
