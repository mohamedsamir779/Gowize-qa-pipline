const Redis = require('ioredis');
const { keys } = require('../data');

const logger = require('./logger');

const redis = new Redis(keys.redis);

module.exports.getKey = (key) => new Promise((resolve, reject) => {
  redis.get(key, (err, result) => {
    if (err) {
      return resolve(null);
    }
    try {
      return resolve(JSON.parse(result));
    } catch (error) {
      return resolve(result);
    }
  });
});

module.exports.setKey = (key, value, expiry) => {
  if (typeof value === 'object') {
    value = JSON.stringify(value);
  }
  if (expiry) {
    return redis.set(key, value, 'EX', expiry);
  }
  return redis.set(key, value);
};

module.exports.exists = (key) => new Promise((resolve, reject) => {
  redis.exists(key, (err, result) => {
    if (err) {
      return resolve(false);
    }
    return resolve(result === 1);
  });
});

module.exports.ttl = (key) => new Promise((resolve, reject) => {
  redis.ttl(key, (err, result) => {
    if (err) {
      return resolve(0);
    }
    return resolve(result);
  });
});

module.exports.deleteUserTokens = async (key = '') => new Promise((resolve, reject) => {
  if (!key || key === '' || key.length !== 24) {
    return reject(new Error('Invalid userID'));
  }
  const stream = redis.scanStream({
    match: `${key}:*`,
    count: 10,
  });
  stream.on('data', (resultKeys) => {
    for (let i = 0; i < resultKeys.length; i++) {
      const foundKey = resultKeys[i];
      redis.del(foundKey);
    }
  });
  stream.on('end', () => {
    logger.info(['all keys have been visited for ', key]);
    return resolve(true);
  });
});

module.exports.getClient = redis;
