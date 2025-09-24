const { logger } = require('src/common/lib');
const Binance = require('./binance');

let settingService;

let WebsocketClients = {};

const initExchange = (name, options) => {
  switch (name) {
    case 'binance': {
      const binanceWS = new Binance({
        ...options,
      });
      logger.info(`Initialized ${name} websocket`);
      WebsocketClients = {
        ...WebsocketClients,
        [`${name}`]: binanceWS,
      };
      return binanceWS;
    }
    default: throw new Error(`This Exchange WS does not exist, ${name}`);
  }
};

const initAllWS = async () => {
  logger.info('Initializing all Exchange Websockets');
  const allExchanges = await settingService.getSettings('exchanges');
  //   const exchanges = allExchanges.filter((x) => x.active === true);
  if (allExchanges && allExchanges.length > 0) {
    allExchanges.forEach((exchange) => {
      try {
        initExchange(exchange.name, exchange);
      } catch (error) {
        logger.error(error.message);
        logger.error(`Error initializing exchange, ${JSON.stringify(exchange)}`);
      }
    });
  } else {
    logger.info('Exchanges list is empty');
  }
};

module.exports.getWebsocketClientForExchange = (id) => WebsocketClients[id];
module.exports.RunAllWebsockets = initAllWS;
module.exports.InitializeExchange = initExchange;
module.exports.InitializeExchanges = () => setTimeout(async () => {
  await initAllWS();
  const test = WebsocketClients.binance;
  if (test) test.createConnection();
}, 2000);

setTimeout(() => {
  const services = require('src/modules/services');
  settingService = services.settingService;
}, 0);
