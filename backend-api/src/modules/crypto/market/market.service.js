//

const {
  Cruds,
  getMarketSymbolFromAssets,
  removeMarketDivider,
} = require('src/common/handlers');
const {
  logger,
} = require('src/common/lib');
const MarketModel = require('./market.model');
const AssetModel = require('../../wallet/asset/asset.model');

class MarketService extends Cruds {
  async createMarket(params) {
    const {
      baseAsset,
      quoteAsset,
      name,
    } = params;
    const [baseRes, quoteRes] = await Promise.allSettled([AssetModel.Model.findOne({
      isCrypto: true,
      symbol: baseAsset,
    }), AssetModel.Model.findOne({
      isCrypto: true,
      symbol: quoteAsset,
    })]);
    if (!baseRes.value || (baseRes.value && !baseRes.value._doc.symbol)) {
      throw new Error(`${baseAsset} does not exist in the assets`);
    }
    if (!quoteRes.value || (quoteRes.value && !quoteRes.value._doc.symbol)) {
      throw new Error(`${quoteAsset} does not exist in the assets`);
    }
    const pairName = getMarketSymbolFromAssets(baseAsset, quoteAsset);
    logger.info(`Market, ${name} [${pairName}] has been added by ${params.createdBy}`);
    return this.create({
      ...params,
      pairName,
      baseAssetId: baseRes.value._doc._id,
      quoteAssetId: quoteRes.value._doc._id,
    });
  }

  async getAllMarkets() {
    if (!this.markets) {
      logger.warn('Fetching markets from database');
      const data = await this.aggregate([
        {
          $group: {
            _id: null,
            markets: {
              $push: '$pairName',
            },
          },
        },
      ]);
      this.markets = data[0] && data[0].markets;
    } else {
      logger.warn('Taking markets data from variable');
    }
    return this.markets;
  }

  async getAllMarketsWithSeperator(separator = '/') {
    let markets;
    if (!this.markets) markets = await this.getAllMarkets();
    else markets = this.markets;
    return markets.map((market) => (removeMarketDivider(market, '/', separator)));
  }

  async findMarketWithoutSeparator(symbol, returnObject = false) {
    if (returnObject) {
      const markets = await this.find();
      return markets.find((market) => `${market.baseAsset}${market.quoteAsset}` === symbol);
    }
    let markets;
    if (!this.markets) markets = await this.getAllMarkets();
    else markets = this.markets;
    return markets.find((market) => removeMarketDivider(market, '/', '') === symbol);
  }

  // update status (active, inactive)
  updateStatus(id, params) {
    return super.updateById(id, params);
  }
}

module.exports = new MarketService(MarketModel.Model, MarketModel.Schema);
