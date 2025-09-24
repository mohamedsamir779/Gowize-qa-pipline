//
const { default: BigNumber } = require('bignumber.js');
const { Cruds, getAssetsFromMarketSymbol } = require('src/common/handlers');

let orderService;
let exchangeBalanceService;
class RiskService extends Cruds {
  _constructor() {
    this.defaultPopulate = [{
      path: 'customerId',
      select: 'firstName lastName category ',
    }];
  }

  getRiskOrderData(order) {
    const {
      status,
      avg,
      filled,
      actFilled,
      symbol,
      type,
      side,
      amount,
      mPrice,
      price,
      fee,
      mFee,
      markup,
      mFeeGroup,
      timeStamp,
    } = order;
    let feeProfit = {
      amount: new BigNumber(0),
      currency: '',
    };
    let profit = {
      amount: new BigNumber(0),
      currency: '',
    };
    if (price && mPrice) {
      const cal = new BigNumber(mPrice)
        .minus(new BigNumber(price))
        .multipliedBy(new BigNumber(filled || amount));
      const currency = getAssetsFromMarketSymbol(symbol).quoteAsset;
      profit = {
        amount: cal,
        currency,
      };
    }
    if (fee && mFee) {
      const cal = new BigNumber(mFee.cost || 0)
        .minus(new BigNumber(fee.cost || 0));
      const { currency } = mFee;
      feeProfit = {
        amount: cal,
        currency,
      };
    }
    return {
      feeProfit,
      profit,
      status,
      avg,
      filled,
      actFilled,
      symbol,
      type,
      side,
      amount,
      mPrice,
      price,
      fee,
      mFee,
      markup,
      mFeeGroup,
      timeStamp,
    };
  }

  async getOrders(params) {
    const orderDocs = await orderService.findWithPagination({
      ...params,
      status: {
        $in: ['closed', 'open'],
      },
    }, {
      populate: this.defaultPopulate,
    });
    orderDocs.docs = orderDocs.docs.map((order) => this.getRiskOrderData(order));
    return orderDocs;
  }

  async getBalances(params = {}) {
    return exchangeBalanceService.getAllAssetBalances(params);
  }
}

module.exports = new RiskService();

setTimeout(() => {
  const services = require('src/modules/services');
  orderService = services.orderService;
  exchangeBalanceService = services.exchangeBalanceService;
}, 0);
