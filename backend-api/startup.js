const { InitializeExchanges } = require('src/modules/crypto/exchange/api');
const { keys } = require('src/common/data')
const { InitializeExchanges: InitializeExchangesWS } = require('src/modules/crypto/exchange/websockets');
const {
  klineService,
} = require('src/modules/services');
require('src/common/handlers/events/listener');
// const BlockChain = require('src/modules/crypto/newBlockchain');
// const scheduler = require('./src/modules/conversionRate/scheduler');
// const cryptoScheduler = require('src/modules/crypto/newBlockchain/scheduler');

module.exports = () => {
  setTimeout(async () => {
    if (keys.enableCrypto) {
      InitializeExchangesWS();
      InitializeExchanges();
      // BlockChain.Initialize();
      // await klineService.updateInitialCacheData();
      // await scheduler.getConversionRates();
      // cryptoScheduler.getEthUpdates();
    }
  }, 5000);
};
