const { keys } = require('src/common/data');
const { logger } = require('src/common/lib');
const Binance = require('./binance');
const FTX = require('./ftx');

let settingService;
let exchangeBalanceService;

const getExchange = (id, params = {}) => {
  switch (id) {
    case 'binance':
      params = {
        ...params,
        apiKey: params.apiKey || keys.binanceKeys.apiKey || '',
        secret: params.secret || keys.binanceKeys.secret || '',
      };
      return new Binance(params);
    case 'ftx':
      params = {
        ...params,
        apiKey: params.apiKey || keys.ftxKeys.apiKey || '',
        secret: params.secret || keys.ftxKeys.secret || '',
      };
      return new FTX(params);
    default:
      throw new Error('Exchange not supported');
  }
};

const initializeBalances = async (exchange) => {
  const ex = getExchange(exchange.name, exchange);
  const data = await ex.fetchExchangeAccountBalances();
  await exchangeBalanceService.update({
    exchange: exchange.name,
  }, {
    ...data,
  }, {
    upsert: true,
  });
  logger.info(`Creation of balances was successful for exchange (${exchange.name})`);
};

const initializeExchanges = async () => {
  logger.info('Initializing all Exchanges');
  const allExchanges = await settingService.getSettings('exchanges');
  if (allExchanges && allExchanges.length > 0) {
    allExchanges.forEach((exchange) => {
      try {
        initializeBalances(exchange);
      } catch (error) {
        logger.error(error.message);
        logger.error(`Error initializing exchange, ${JSON.stringify(exchange)}`);
      }
    });
  } else {
    logger.info('Exchanges list is empty');
  }
};

module.exports.getExchange = getExchange;

module.exports.InitializeExchanges = () => setTimeout(async () => {
  await initializeExchanges();
}, 2000);

setTimeout(() => {
  const services = require('src/modules/services');
  settingService = services.settingService;
  exchangeBalanceService = services.exchangeBalanceService;
}, 0);
