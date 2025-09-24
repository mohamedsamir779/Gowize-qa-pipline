//
const { default: BigNumber } = require('bignumber.js');
const BN = require('bignumber.js');
const {
  Cruds,
  SendEvent,
} = require('src/common/handlers');
const WalletModel = require('src/modules/wallet/wallet.model');
const { CONSTANTS } = require('src/common/data');
const ConvertModel = require('./convert.model');
const AssetModel = require('../../wallet/asset/asset.model');
const MarketModel = require('../market/market.model');

let markupService;
let pricingService;
let walletService;
let feeGroupService;

class ConvertService extends Cruds {
  _constructor() {
    this.defaultPopulate = [{
      path: 'customerId',
      select: 'firstName lastName category',
    }];
  }

  async findCommonAsset(assetOne, assetTwo) {
    return 'USDT';
  }

  async checkConvert(from, to, amount, customerId) {
    const [
      fromAssetCheck,
      toAssetCheck,
    ] = await Promise.allSettled([
      AssetModel.Model.findOne({
        symbol: from,
      }),
      AssetModel.Model.findOne({
        symbol: to,
      }),
    ]);
    const fromAsset = fromAssetCheck
      && fromAssetCheck.value
      && fromAssetCheck.value._doc;
    const toAsset = toAssetCheck
      && toAssetCheck.value
      && toAssetCheck.value._doc;
    if (!fromAsset) {
      throw new Error(`Invalid from asset, ${from}`);
    }
    if (!toAsset) {
      throw new Error(`Invalid to asset, ${to}`);
    }
    const commonAsset = await this.findCommonAsset(fromAsset, toAsset);
    const fromPN = from === 'USDT' ? `${to}/${commonAsset}` : `${from}/${commonAsset}`;
    const toPN = to === 'USDT' ? `${from}/${commonAsset}` : `${to}/${commonAsset}`;
    const [
      fromMarketInSystem,
      toMarketInSystem,
      customerFromWalletResponse,
      customerToWalletResponse,
    ] = await Promise.allSettled([
      MarketModel.Model.findOne({
        pairName: fromPN,
      }),
      MarketModel.Model.findOne({
        pairName: toPN,
      }),
      WalletModel.Model.findOne({
        asset: fromAsset.symbol,
        belongsTo: customerId,
      }),
      WalletModel.Model.findOne({
        asset: toAsset.symbol,
        belongsTo: customerId,
      }),
    ]);
    const fromMarket = fromMarketInSystem
      && fromMarketInSystem.value
      && fromMarketInSystem.value._doc;
    const toMarket = toMarketInSystem
      && toMarketInSystem.value
      && toMarketInSystem.value._doc;
    const customerBaseWallet = customerFromWalletResponse
      && customerFromWalletResponse.value
      && customerFromWalletResponse.value._doc;
    const customerQuoteWallet = customerToWalletResponse
      && customerToWalletResponse.value
      && customerToWalletResponse.value._doc;
    if (!fromMarket) {
      throw new Error(`Could not find market for, ${from}`);
    }
    if (!toMarket) {
      throw new Error(`Could not find market for, ${to}`);
    }
    if (!customerBaseWallet || (!customerBaseWallet.asset)) {
      throw new Error(`Customer ${from}, wallet not found`);
    }
    if (!customerQuoteWallet || (!customerQuoteWallet.asset)) {
      throw new Error(`Customer ${to}, wallet not found`);
    }
    const baseAmountBN = new BigNumber(customerBaseWallet.amount);
    const amountBN = new BigNumber(amount);
    if (baseAmountBN.isLessThan(amountBN)) {
      throw new Error('Customer base wallet balance insufficient');
    }
    return commonAsset;
  }

  getMarketPrice(priceData, markupDetails, buy = true) {
    let returnPrice = 1;
    if (buy && priceData && priceData.buyPrice) {
      returnPrice = markupService.getMarkedUpAmount(
        markupDetails,
        priceData.buyPrice,
        priceData.pairName,
      );
    } else if (!buy && priceData && priceData.sellPrice) {
      returnPrice = markupService.getMarkedDownAmount(
        markupDetails,
        priceData.buyPrice,
        priceData.pairName,
      );
    }
    return returnPrice;
  }

  async convert(params) {
    const {
      fromAsset,
      toAsset,
      fromAssetId,
      toAssetId,
      customerId,
      amount,
    } = params;
    // const frozenAssets = await walletService.freezeAmountForOrder();
    let commonAsset;
    let fromAssetPriceData;
    let toAssetPriceData;
    let fromAssetPrice;
    let toAssetPrice;
    if ((toAsset === 'USD' && fromAsset === 'USDT') || (fromAsset === 'USD' && toAsset === 'USDT')) {
      commonAsset = 'USDT';
      fromAssetPrice = 1;
      toAssetPrice = 1;
    } else if (toAsset === 'USD') {
      commonAsset = 'USDT';
      fromAssetPriceData = await pricingService.getPriceDetails(`${fromAsset}/${commonAsset}`);
      toAssetPriceData = await pricingService.getPriceDetails(`${toAsset}/${commonAsset}`);
      const markupDetails = await markupService.getMarkupDataForCustomer(customerId);
      fromAssetPrice = this.getMarketPrice(fromAssetPriceData, markupDetails, false);
      toAssetPrice = this.getMarketPrice(toAssetPriceData, markupDetails, true);
    } else {
      commonAsset = await this.checkConvert(fromAsset, toAsset, amount, customerId);
      fromAssetPriceData = await pricingService.getPriceDetails(`${fromAsset}/${commonAsset}`);
      toAssetPriceData = await pricingService.getPriceDetails(`${toAsset}/${commonAsset}`);
      const markupDetails = await markupService.getMarkupDataForCustomer(customerId);
      fromAssetPrice = this.getMarketPrice(fromAssetPriceData, markupDetails, false);
      toAssetPrice = this.getMarketPrice(toAssetPriceData, markupDetails, true);
    }
    const customerFeeData = await feeGroupService.getFeeGroupForCustomer(customerId);
    const feeData = await feeGroupService.getFeeForMarketFromData(customerFeeData, `${toAsset}/${commonAsset}`);
    const { toAmount, ...rest } = await walletService.transferBalanceForConvert({
      fromAsset,
      toAsset,
      customerId,
      amount,
      fromAssetPriceData: fromAssetPrice,
      toAssetPriceData: toAssetPrice,
      feeData,
    });
    const data = {
      fromAsset,
      toAsset,
      fromAssetId,
      toAssetId,
      customerId,
      amount,
      toAmount,
      fromAssetPrice,
      toAssetPrice,
      commonAsset,
      mFeeGroup: feeData,
      mFee: rest,
      status: 'closed',
    };
    SendEvent(
      CONSTANTS.EVENT_TYPES.EVENT_LOG,
      CONSTANTS.LOG_TYPES.CONVERT,
      {
        customerId: params.customerId,
        userId: params.userId,
        triggeredBy: params.userId ? 1 : 0,
        userLog: false,
        level: CONSTANTS.LOG_LEVELS.INFO,
        details: {},
        content: data,
      },
    );
    return this.create(data);
  }

  async checkPreviewConvert(params) {
    const { from, to } = params;
    const [
      fromAssetCheck,
      toAssetCheck,
    ] = await Promise.allSettled([
      AssetModel.Model.findOne({
        symbol: from,
      }),
      AssetModel.Model.findOne({
        symbol: to,
      }),
    ]);
    const fromAsset = fromAssetCheck
      && fromAssetCheck.value
      && fromAssetCheck.value._doc;
    const toAsset = toAssetCheck
      && toAssetCheck.value
      && toAssetCheck.value._doc;
    if (!fromAsset) {
      throw new Error(`Invalid from asset, ${from}`);
    }
    if (!toAsset) {
      throw new Error(`Invalid to asset, ${to}`);
    }
    const commonAsset = await this.findCommonAsset(fromAsset, toAsset);
    const fromPN = from === 'USDT' ? `${to}/${commonAsset}` : `${from}/${commonAsset}`;
    const toPN = to === 'USDT' ? `${from}/${commonAsset}` : `${to}/${commonAsset}`;
    const [
      fromMarketInSystem,
      toMarketInSystem,
    ] = await Promise.allSettled([
      MarketModel.Model.findOne({
        pairName: fromPN,
      }),
      MarketModel.Model.findOne({
        pairName: toPN,
      })]);
    const fromMarket = fromMarketInSystem
      && fromMarketInSystem.value
      && fromMarketInSystem.value._doc;
    const toMarket = toMarketInSystem
      && toMarketInSystem.value
      && toMarketInSystem.value._doc;
    if (!fromMarket) {
      throw new Error(`Could not find market for, ${from}`);
    }
    if (!toMarket) {
      throw new Error(`Could not find market for, ${to}`);
    }
    return commonAsset;
  }

  async previewConversion(params) {
    const { from, to, customerId } = params;
    let commonAsset;
    let fromAssetPriceData;
    let toAssetPriceData;
    let fromPrice;
    let toPrice;
    if ((to === 'USD' && from === 'USDT') || (from === 'USD' && to === 'USDT')) {
      commonAsset = 'USDT';
      fromAssetPriceData = 1;
      toAssetPriceData = 1;
    } else if (to === 'USD') {
      commonAsset = 'USDT';
      fromAssetPriceData = await pricingService.getPriceDetails(`${from}/${commonAsset}`);
      toAssetPriceData = await pricingService.getPriceDetails(`${to}/${commonAsset}`);
      const markupDetails = await markupService.getMarkupDataForCustomer(customerId);
      fromPrice = this.getMarketPrice(fromAssetPriceData, markupDetails, false);
      toPrice = this.getMarketPrice(toAssetPriceData, markupDetails, true);
    } else {
      commonAsset = await this.checkPreviewConvert(params);
      fromAssetPriceData = await pricingService.getPriceDetails(`${from}/${commonAsset}`);
      toAssetPriceData = await pricingService.getPriceDetails(`${to}/${commonAsset}`);
      const markupDetails = await markupService.getMarkupDataForCustomer(customerId);
      fromPrice = this.getMarketPrice(fromAssetPriceData, markupDetails, false);
      toPrice = this.getMarketPrice(toAssetPriceData, markupDetails, true);
    }
    const fromAssetPrice = new BN(fromPrice);
    const toAssetPrice = new BN(toPrice);
    const fromTo = parseFloat(fromAssetPrice.dividedBy(toAssetPrice).toString());
    const toFrom = parseFloat(toAssetPrice.dividedBy(fromAssetPrice).toString());
    return {
      [`${from}_${to}`]: fromTo,
      [`${to}_${from}`]: toFrom,
    };
  }
}

module.exports = new ConvertService(ConvertModel.Model, ConvertModel.Schema);

setTimeout(() => {
  const services = require('src/modules/services');
  markupService = services.markupService;
  pricingService = services.pricingService;
  walletService = services.walletService;
  feeGroupService = services.feeGroupService;
}, 0);
