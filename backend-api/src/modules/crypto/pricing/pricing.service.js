//
const { default: BigNumber } = require('bignumber.js');
const { Cruds, removeMarketDivider } = require('src/common/handlers');
const { permissionsGroup, CONSTANTS } = require('src/common/data');
const { sockets: SocketIO } = require('src/common/lib');
const PricingModel = require('./pricing.model');

let marketService;
let markupService;
class PricingService extends Cruds {
  async upsertPriceValue(params = {}) {
    const {
      pairName,
      marketId,
      ...rest
    } = params;
    return this.Model.findOneAndUpdate({
      pairName,
      marketId,
    }, {
      ...rest,
    }, {
      new: true,
      upsert: true,
    });
  }

  calculatePercentage(pricinData = {}) {
    const open = new BigNumber(pricinData.open || 0);
    const close = new BigNumber(pricinData.close || 0);
    return close.minus(open).dividedBy(open).multipliedBy(100).toFormat(2);
  }

  makeBroadcaseSocketData(markups, allPricingData) {
    const d = {};
    markups.forEach((markupData) => {
      const markedUpPricing = allPricingData.map((x) => {
        const mDataForSymbol = markupService.getMarkupForMarketFromData(markupData, x.pairName);
        return {
          ...x,
          open: markupService.getMarkedUpAmount(mDataForSymbol, x.open),
          close: markupService.getMarkedUpAmount(mDataForSymbol, x.close),
          high: markupService.getMarkedUpAmount(mDataForSymbol, x.high),
          low: markupService.getMarkedUpAmount(mDataForSymbol, x.low),
          percentage: this.calculatePercentage(x),
        };
      });
      const key = markupData.isDefault ? 'pricing' : `pricing_${markupData._id}`;
      d[key] = markedUpPricing;
    });
    return d;
  }

  async pushAllData(data = [], exchange) {
    const allMarkets = await marketService.find({}, { pairName: 1 });
    const markups = await markupService.find({});
    const conn = SocketIO.connection();
    const socketData = [];
    allMarkets.forEach((marketData) => {
      const marketPricing = data.find((x) => x.symbol === removeMarketDivider(marketData.pairName));
      if (marketPricing) {
        // logger.info(`Updated price for ${marketData.pairName}, Price: ${marketPricing.close}`);
        const dataSend = {
          ...marketPricing,
          percentage: this.calculatePercentage(marketPricing),
          pairName: marketData.pairName,
        };
        socketData.push(dataSend);
        this.upsertPriceValue({
          pairName: marketData.pairName,
          marketId: marketData._id,
          marketPrice: marketPricing.close,
          exchange,
          open: marketPricing.open,
          close: marketPricing.close,
          percentage: dataSend.percentage,
          volume: marketPricing.quoteAssetVolume,
        });
      } else {
        // eslint-disable-next-line max-len
        // logger.error(`Could not find pricing for ${marketData.pairName}(${removeMarketDivider(marketData.pairName)})`);
      }
    });
    const events = this.makeBroadcaseSocketData(markups, socketData);
    Object.keys(events).forEach((key) => {
      conn.broadcastEvent(key, events[key]);
    });
  }

  async getPriceDetails(pairName) {
    return this.findOne({
      pairName,
    });
  }

  /**
   * This function gets the marked up/down price in case of market/limit orders
   * @param {*MarkupModel} markUpData
   * @param {*String} pairName
   * @param {*String} type
   * @param {*String} side
   * @param {*String} exchange
   * @param {*Number} price
   * @returns {PricingModel}
   */
  async getMarkedPrice(
    markUpData,
    pairName,
    type = 'limit',
    side = 'buy',
    exchange = 'binance',
    price = null,
  ) {
    const foundPair = await this.findOne({
      pairName,
      exchange,
    });
    if (type === 'market' && price) {
      return {
        ...foundPair,
        marketPrice: price,
        mPrice: side === 'buy'
          ? markupService.getMarkedUpAmount(markUpData, price)
          : markupService.getMarkedDownAmount(markUpData, price),
      };
    }
    if (!price) price = foundPair.marketPrice;
    if (type === 'market') {
      return {
        ...foundPair,
        mPrice: side === 'buy'
          ? markupService.getMarkedUpAmount(markUpData, price)
          : markupService.getMarkedDownAmount(markUpData, price),
      };
    }
    if (type === 'limit') {
      return {
        ...foundPair,
        mPrice: price,
        marketPrice: side === 'buy'
          ? markupService.getMarkedDownAmount(markUpData, price)
          : markupService.getMarkedUpAmount(markUpData, price),
      };
    }
    return {
      ...foundPair,
      mPrice: price,
      marketPrice: price,
    };
  }

  async getMultipleMarkupPricing(data = [], markupId) {
    const markupData = await markupService.getMarkupData(markupId);
    data = data.map((d) => ({
      ...d,
      marketPrice: markupService.getMarkedUpAmount(markupData, d.marketPrice),
      open: markupService.getMarkedUpAmount(markupData, d.open),
      close: markupService.getMarkedUpAmount(markupData, d.close),
      percentage: this.calculatePercentage(d),
      volume: d.volume || '0',
    }));
    return data;
  }

  async getAllPricingDataWithMarkets(markupId = null) {
    const pricingData = await this.find({}, {}, {
      populate: [{
        path: 'marketId',
        select: 'name baseAsset quoteAsset pairName baseAssetId quoteAssetId',
        populate: [{
          path: 'baseAssetId',
          select: 'symbol image isCrypto',
        }, {
          path: 'quoteAssetId',
          select: 'symbol image isCrypto',
        }],
      }],
    });
    const data = this.getMultipleMarkupPricing(pricingData, markupId);
    return data;
  }
}

module.exports = new PricingService(PricingModel.Model, PricingModel.Schema);

setTimeout(() => {
  const services = require('src/modules/services');
  marketService = services.marketService;
  markupService = services.markupService;
}, 0);
