const mongoose = require('mongoose');

const { keys } = require('../data');
const logger = require('./logger');

const connectDb = () => mongoose.connect(keys.mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true,
  serverSelectionTimeoutMS: 5000000,
})
  .then((db) => {
    logger.info('Connected to MongoDB...');
    // dbWatcher();
    return db;
  })
  .catch((err) => {
    logger.error('Could not connect to MongoDB, exiting the application');
    process.exit();
    return null;
  });
module.exports = connectDb;
