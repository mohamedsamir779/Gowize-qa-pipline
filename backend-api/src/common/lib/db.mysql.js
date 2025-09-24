const { Sequelize, Model, DataTypes } = require('sequelize');
const mysqlConfig = require('../data/keys').mysql;
const logger = require('./logger');

const configSequelize = {
  HOST: mysqlConfig.host,
  USER: mysqlConfig.username,
  PASSWORD: mysqlConfig.password,
  DB: mysqlConfig.database,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

const sequelize = new Sequelize(
  configSequelize.DB, configSequelize.USER, configSequelize.PASSWORD, {
    host: configSequelize.HOST,
    dialect: configSequelize.dialect,
    // operatorsAliases: false,
    port: process.env.MYSQL_PORT || 3306,
    pool: {
      max: configSequelize.pool.max,
      min: configSequelize.pool.min,
      acquire: configSequelize.pool.acquire,
      idle: configSequelize.pool.idle,
    },
    logging: true,
    sync: true,
  },
);

sequelize.authenticate().then(() => {
  logger.info('MySQL Connection has been established successfully.');
}).catch((error) => {
  logger.error(`Unable to connect to the MySQL database. ${configSequelize.HOST}:${configSequelize.USER} : `, error.message);
});

module.exports = {
  sequelize, DataTypes, Model,
};
