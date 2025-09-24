//
const { default: BigNumber } = require('bignumber.js');
const { Cruds } = require('src/common/handlers');
const { logger } = require('src/common/lib');
const { CONSTANTS } = require('src/common/data');
const allServices = require('src/modules/services');

const {
  orderService,
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

  async onBinanceOrderUpdate(data) {
    const {
      executionType,
      clientOrderId,
      origClientOrderId,
      orderQty,
      lastExQty,
      lastExPrice,
      transactionTime,
      commissionPrice,
      commissionAsset,
      orderId: wsOrderId,
      exchangeName,
    } = data;
    const [orderId, customerId] = executionType === 'CANCELED' ? origClientOrderId.split('___') : clientOrderId.split('___');
    const query = {
      recordId: parseInt(orderId, 10),
      customerId,
    };
    const findOrder = await OrderModel.Model.findOne(query, null, { lean: true });
    if (!findOrder) {
      logger.error(`Order not found in DB, ${orderId}, ${clientOrderId}`);
      return;
    }
    const orderDetails = await orderService.getOrderFromExchangeViaExchangeId(
      exchangeName,
      wsOrderId,
      findOrder.symbol,
    );
    if (executionType === 'NEW') {
      await OrderModel.Model.updateOne(query, {
        status: orderDetails.status,
      });
    } else if (executionType === 'TRADE') {
      const { avg, filled } = this.calculateAvgPrice(findOrder, data);
      let excess = false;
      let hide = false;
      let partial = false;
      let actFilled = filled;
      const frozenBN = new BigNumber(findOrder.frozenAmount);
      const checkBN = avg.multipliedBy(filled);
      let excessAmount = 0;
      if (findOrder.excess) {
        hide = true;
        excessAmount = checkBN
          .minus(frozenBN)
          .dividedBy(new BigNumber(lastExPrice))
          .plus(new BigNumber(excessAmount));
        partial = false;
      } else if (checkBN.isGreaterThan(frozenBN)) {
        excessAmount = checkBN
          .minus(frozenBN)
          .dividedBy(new BigNumber(lastExPrice));
        excess = true;
        partial = true;
        actFilled = new BigNumber(findOrder.filled)
          .plus(new BigNumber(lastExQty)
            .minus(excessAmount));
      }
      await OrderModel.Model.updateOne(query, {
        remaining: orderDetails.remaining,
        filled: orderDetails.filled,
        status: orderDetails.status,
        cost: orderDetails.cost,
        price: orderDetails.price,
        avg,
        excess,
        actFilled,
        excessAmount,
      });
      const pricingData = await pricingService.getMarkedPrice(
        findOrder.markup,
        findOrder.symbol,
        findOrder.type,
        findOrder.side,
        findOrder.exchange,
        lastExPrice,
      );
      const mFee = await walletService.moveBalanceFromFrozenForTrade({
        ...findOrder,
        remaining: orderDetails.remaining,
        price: pricingData ? pricingData.marketPrice : lastExPrice,
        mPrice: pricingData ? pricingData.mPrice : lastExPrice,
        amount: lastExQty,
        feeData: findOrder.mFeeGroup,
      });
      logger.info(`Created a trade for ${findOrder.symbol}, 
      Amount: ${lastExQty}, 
      Price: ${lastExPrice}, 
      OrderId: ${findOrder._id}, 
      Time: ${transactionTime}, 
      Commission: ${commissionPrice} ${commissionAsset}`);
      await this.create({
        symbol: findOrder.symbol,
        amount: lastExQty,
        price: lastExPrice,
        mPrice: pricingData && pricingData.mPrice,
        orderId: findOrder._id,
        quoteAmount: orderQty,
        time: transactionTime,
        customerId: findOrder.customerId,
        commission: commissionPrice,
        commissionAsset,
        excess,
        hide,
        partial,
        excessAmount,
        ...mFee,
      });
      if (orderDetails.status === 'closed') {
        this.updateOrderWithFee(findOrder._id, customerId, mFee);
      }
      // await walletService.changeBalanceViaWalletId(walletId, )
    } else if (executionType === 'REJECTED') {
      await OrderModel.Model.updateOne(query, {
        remaining: orderDetails.remaining,
        filled: orderDetails.filled,
        status: orderDetails.status,
        cost: orderDetails.cost,
        price: orderDetails.price,
      });
    } else if (executionType === 'EXPIRED') {
      await OrderModel.Model.updateOne(query, {
        remaining: orderDetails.remaining,
        filled: orderDetails.filled,
        status: orderDetails.status,
        cost: orderDetails.cost,
        price: orderDetails.price,
      });
    } else if (executionType === 'CANCELED') {
      await walletService.revertFrozenAmountForOrder(findOrder);
      logger.info(`Canceled an order for ${findOrder.symbol}, 
      Remaining : ${orderDetails.remaining}, 
      Filled: ${orderDetails.filled}, 
      OrderId: ${findOrder._id}, 
      Time: ${transactionTime}, 
      Commission: ${commissionPrice} ${commissionAsset}`);
      await OrderModel.Model.updateOne(query, {
        remaining: orderDetails.remaining,
        filled: orderDetails.filled,
        status: orderDetails.status,
        cost: orderDetails.cost,
        price: orderDetails.price,
      });
    }
  }

  async updateOrderWithFee(orderId, customerId, feeDetails) {
    const trades = await this.find({
      orderId,
      customerId,
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
    await OrderModel.Model.findByIdAndUpdate(orderId, {
      mFee,
    });
  }
}

module.exports = new TradeService(TradeModel.Model, TradeModel.Schema);
