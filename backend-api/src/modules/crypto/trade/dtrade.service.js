//
const { default: BigNumber } = require('bignumber.js');
const { Cruds } = require('src/common/handlers');
const { logger } = require('src/common/lib');
const allServices = require('src/modules/services');

const {
  pricingService,
  walletService,
} = allServices;
const OrderModel = require('../order/order.model');
const TradeModel = require('./trade.model');

class TradeService extends Cruds {
  calculateAvgPrice(order, tradeData) {
    let {
      lastExQty,
      lastExPrice,
    } = tradeData;
    let {
      avg = 0,
      filled = 0,
    } = order;
    avg = new BigNumber(avg);
    filled = new BigNumber(filled);
    lastExQty = new BigNumber(lastExQty);
    lastExPrice = new BigNumber(lastExPrice);
    if (filled.isEqualTo(0)) {
      return {
        filled: lastExQty,
        avg: lastExPrice,
      };
    }
    const newFilled = filled.plus(lastExQty);
    const newAvgPrice = avg
      .multipliedBy(filled)
      .plus(lastExPrice.multipliedBy(lastExQty)).dividedBy(newFilled);
    return {
      avg: newAvgPrice,
      filled: newFilled,
    };
  }

  async generateTradesForDemoOrder(order = {}) {
    const {
      amount,
      mPrice,
      price,
      customerId,
    } = order;
    const tradeData = {
      lastExPrice: mPrice,
      lastExQty: amount,
    };
    const { avg, filled } = this.calculateAvgPrice(order, tradeData);
    let excess = false;
    let hide = false;
    let partial = false;
    let actFilled = filled;
    const frozenBN = new BigNumber(order.frozenAmount);
    const checkBN = avg.multipliedBy(filled);
    let excessAmount = 0;
    if (order.excess) {
      hide = true;
      excessAmount = checkBN
        .minus(frozenBN)
        .dividedBy(new BigNumber(mPrice))
        .plus(new BigNumber(excessAmount));
      partial = false;
    } else if (checkBN.isGreaterThan(frozenBN)) {
      excessAmount = checkBN
        .minus(frozenBN)
        .dividedBy(new BigNumber(mPrice));
      excess = true;
      partial = true;
      actFilled = new BigNumber(order.filled)
        .plus(new BigNumber(amount)
          .minus(excessAmount));
    }
    await OrderModel.DemoModel.updateOne({
      _id: order._id,
    }, {
      remaining: order.remaining,
      filled: amount,
      status: 'closed',
      cost: new BigNumber(price).multipliedBy(amount),
      price,
      avg,
      excess,
      actFilled,
      excessAmount,
    });
    const pricingData = await pricingService.getMarkedPrice(
      order.markup,
      order.symbol,
      order.type,
      order.side,
      order.exchange,
      mPrice,
    );
    const mFee = await walletService.moveBalanceFromFrozenForTrade({
      ...order._doc,
      remaining: order.remaining,
      price: pricingData ? pricingData.marketPrice : mPrice,
      mPrice: pricingData ? pricingData.mPrice : mPrice,
      amount,
      feeData: order.mFeeGroup,
    });
    logger.info(`Created a trade for ${order.symbol}, 
      Amount: ${amount}, 
      Price: ${mPrice}, 
      OrderId: ${order._id}, 
      Time: ${new Date()}, 
      Commission: ${0} ${0}`);
    await this.create({
      symbol: order.symbol,
      amount,
      price: mPrice,
      mPrice: pricingData && pricingData.mPrice,
      orderId: order._id,
      quoteAmount: amount,
      time: new Date(),
      customerId: order.customerId,
      commission: 0,
      commissionAsset: 'N/a',
      excess,
      hide,
      partial,
      excessAmount,
      ...mFee,
    });
    this.updateOrderWithFee(order._id, customerId, mFee);
  }

  async updateOrderWithFee(orderId, customerId, feeDetails) {
    const trades = await this.find({
      orderId,
      customerId,
      testnet: true,
    }, { mCommission: 1, mCommissionAsset: 1 });
    let cost;
    const currency = feeDetails.mCommissionAsset;
    if (trades && trades.length > 0) {
      cost = trades.reduce(
        (totalBN, currentTrade) => totalBN.plus(
          new BigNumber(currentTrade.mCommission || 0),
        ), new BigNumber(0),
      );
    } else {
      cost = feeDetails.mCommission || 0;
    }
    const mFee = {
      cost: cost.toString(),
      currency,
    };
    await OrderModel.DemoModel.findByIdAndUpdate(orderId, {
      mFee,
    });
  }
}

module.exports = new TradeService(TradeModel.DemoModel, TradeModel.Schema);
