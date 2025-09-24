/* eslint-disable no-case-declarations */
const request = require('request');
const https = require('https');
const crypto = require('crypto');
const mongoose = require('mongoose');
const { keys: { epayme } } = require('src/common/data');
const { logger } = require('src/common/lib');
const {
  CustomError,
} = require('src/common/handlers');
const orderService = require('src/modules/psps/psporder.service');
const currencyRateService = require('src/modules/conversionRate/conversionRate.service');
const { CONSTANTS } = require('src/common/data');
const allServices = require('src/modules/services');
const { Model: OrderModel } = require('../psporder.model');

const { fxTransactionService, transactionService, accountService, walletService } = allServices;

const PAYMENT_GATEWAY = 'EPAYME';
const PAYOUT = 'PAYOUT';
const WITHDRAWAL = 'WITHDRAWAL';

class EpaymeService {
  async pay(bodyParams, userParams) {
    const {
      tradingAccountId,
      amount,
      language,
      currency,
      walletId,
    } = bodyParams;
    const {
      email,
      _id,
      firstName,
      lastName,
      phone,
      ip = '127.0.0.1',
    } = userParams;
    const wallet = await walletService.findById(walletId);
    const tradingAccount = await accountService.findById(tradingAccountId);
    const currencyRate = await currencyRateService.findOne({
      baseCurrency: 'USD',
      targetCurrency: wallet?.asset ?? tradingAccount?.currency,
    });
    if (!currencyRate) throw new Error('Currency Rates not found');
    const conversionRate = currencyRate.value;
    const usdAmount = parseFloat(amount) / parseFloat(conversionRate);

    const orderData = {
      amount: usdAmount,
      currency: 'USD',
      customerId: _id,
      language,
      gateway: PAYMENT_GATEWAY,
      paymentGateway: PAYMENT_GATEWAY,
      convertedAmount: amount,
      paymentForModel: tradingAccountId
        ? CONSTANTS?.PAYMENT_FOR_MODELS?.TRADING_ACCOUNT : CONSTANTS?.PAYMENT_FOR_MODELS?.WALLET,
      paymentFor: tradingAccountId || walletId,
      dataPrimary: {
        gatewayAmount: amount,
        gatewayCurrency: currency,
      },
    };

    const order = await orderService.create(orderData);
    if (!order) { throw new Error('Can\'t find order'); }

    const merchantData = {
      customerId: _id,
      channelId: 'WEB',
      merchantId: epayme?.merchantId,
      orderID: order._id.toString(),
      orderDescription: 'Deposit',
      orderAmount: amount,
      mobilenumber: phone,
      email,
      merchantType: 'ECOMMERCE',
      orderCurrency: currency,
      url: epayme?.apiUrl,
    };
    return merchantData;
  }

  async callback(params) {
    const {
      customerid, orderid, transt, mid,
    } = params;
    console.log("params callback", params);
    if (mid !== epayme.merchantId) throw new Error('not authorized');
    if (!customerid || !orderid) throw new Error('not authorized');
    const order = await orderService.findOne({
      customerId: new mongoose.Types.ObjectId(customerid),
      _id: new mongoose.Types.ObjectId(orderid),
    });
    console.log("params callback order", order);
    if (!order) throw new Error('Cannot find specified order');
    if (order.status !== 'UNPAID') throw new Error('this order is already processed');
    if (transt === 'APM_PAYMENT_ACCEPTED' || transt === 'PURCHASED') {
      if (order.paymentForModel === CONSTANTS.PAYMENT_FOR_MODELS.TRADING_ACCOUNT) {
        const tradingAccount = await accountService.findById(order.paymentFor);
        const transaction = await fxTransactionService.addApprovedDeposit({
          customerId: order.customerId,
          currency: order.currency,
          gateway: CONSTANTS.TRANSACTIONS_GATEWAYS.EPAYME,
          type: CONSTANTS.TRANSACTIONS_TYPES.DEPOSIT,
          tradingAccountId: order.paymentFor,
          amount: order.amount,
          rawData: {
            gatewayAmount: order.dataPrimary.gatewayAmount,
            gatewayCurrency: order.currency,
          },
        }, { ...tradingAccount });
        await orderService.updateById(order._id, {
          transactionIdModel: CONSTANTS.TRANSACTIONS_MODEL_TYPES.FX,
          transactionId: transaction._id,
        });
      } else {
        const transaction = await transactionService.basicDeposit({
          walletId: order.paymentFor,
          customerId: order.customerId,
          amount: order.amount,
          gateway: CONSTANTS.TRANSACTIONS_GATEWAYS.EPAYME,
          isAutoApprove: true,
          currency: order.currency,
        });
        await orderService.updateById(order._id, {
          transactionIdModel: CONSTANTS.TRANSACTIONS_MODEL_TYPES.WALLET,
          transactionId: transaction._id,
        });
      }
      await orderService.markPaid(order._id);
      return true;
    } if (transt !== 'in_process' && transt !== 'pending' && transt !== 'authorized') {
      if (order.paymentForModel === CONSTANTS.PAYMENT_FOR_MODELS.TRADING_ACCOUNT) {
        const tradingAccount = await accountService.findById(order.paymentFor);
        const transaction = await fxTransactionService.addRejectedDeposit({
          customerId: order.customerId,
          currency: order.currency,
          gateway: CONSTANTS.TRANSACTIONS_GATEWAYS.EPAYME,
          type: CONSTANTS.TRANSACTIONS_TYPES.DEPOSIT,
          tradingAccountId: order.paymentFor,
          amount: order.amount,
          rawData: {
            gatewayAmount: order.dataPrimary.gatewayAmount,
            gatewayCurrency: order.currency,
          },
        }, { ...tradingAccount });
        await orderService.updateById(order._id, {
          transactionIdModel: CONSTANTS.TRANSACTIONS_MODEL_TYPES.FX,
          transactionId: transaction._id,
        });
      } else {
        const transaction = await transactionService.createPendingTransaction('DEPOSIT', {
          type: 'DEPOSIT',
          walletId: order.paymentFor,
          customerId: order.customerId,
          amount: order.amount,
          gateway: CONSTANTS.TRANSACTIONS_GATEWAYS.EPAYME,
          currency: order.currency,
        });
        await transactionService.rejectDeposit({ id: transaction._id });
        await orderService.updateById(order._id, {
          transactionIdModel: CONSTANTS.TRANSACTIONS_MODEL_TYPES.WALLET,
          transactionId: transaction._id,
        });
      }
      await orderService.markFailed(order._id);
      return true;
    }
    return false;
  }
}
module.exports = new EpaymeService();
