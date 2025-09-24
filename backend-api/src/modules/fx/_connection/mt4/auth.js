const axios = require('axios');
const { keys } = require('src/common/data');
const { logger } = require('src/common/lib');

const configKeys = keys.mt4;
const liveKeys = configKeys.live;
const demoKeys = configKeys.demo;

const DemoInstance = axios.create({
  baseURL: demoKeys.MT4_HOST,
  timeout: 1000,
  headers: {
    username: demoKeys.MT4_USERNAME,
    password: demoKeys.MT4_PASSWORD,
  },
});

const LiveInstance = axios.create({
  baseURL: liveKeys.MT4_HOST,
  timeout: 1000,
  headers: {
    username: demoKeys.MT4_USERNAME,
    password: demoKeys.MT4_PASSWORD,
  },
});

module.exports = (isDemo = false) => {
  if (isDemo) {
    return DemoInstance;
  }
  return LiveInstance;
};
