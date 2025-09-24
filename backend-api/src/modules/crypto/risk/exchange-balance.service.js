const { Cruds } = require('src/common/handlers');
const allServices = require('src/modules/services');

const {
  assetService,
} = allServices;

const ExchangeBalanceModel = require('./exchange-balance.model');

class ExchangeBalanceService extends Cruds {
  async getAllAssetBalances(params = {}) {
    let {
      exchange,
      type = 'free',
      asset,
    } = params;
    if (exchange) exchange = exchange.toLowerCase();
    const assets = await assetService.getAllAssets();
    let data;
    if (exchange) {
      data = await this.find({
        exchange,
      });
    } else {
      data = await this.find();
    }
    data = data.map((exchangeBalances) => {
      let d = exchangeBalances[type];
      d = asset
        ? [asset].reduce((res, key) => Object.assign(res, { [key]: d[key] || 0 }), {})
        : assets.reduce((res, key) => Object.assign(res, { [key]: d[key] || 0 }), {});
      return {
        exchange: exchangeBalances.exchange,
        balances: d,
      };
    });
    return data;
  }
}

module.exports = new ExchangeBalanceService(
  ExchangeBalanceModel.Model,
  ExchangeBalanceModel.Schema,
);
