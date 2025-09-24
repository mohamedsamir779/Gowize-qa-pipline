const { finiticPay, backendURL, frontendRedirectUrl } = require('src/common/data').keys;
const { CONSTANTS } = require('src/common/data');
const axios = require('axios');
const {
  pspOrdersService,
  transactionService,
  walletService,
  conversionRateService,
  fxTransactionService,
} = require('src/modules/services');
const { logger } = require('src/common/lib');

const LOG_TAG = 'FINITIC_PAY_SERVICE';

const fp = axios.default.create({
  baseURL: finiticPay.depositUrl,
});

class FiniticPayService {
  async handleCreateWalletOrder(payload) {
    const {
      walletId,
      amount,
      customerId,
      language = 'en-gb',
      note,
    } = payload;
    const wallet = await walletService.findById(walletId);
    const usdConversion = await conversionRateService.getConversionRate({
      baseCurrency: wallet.asset,
      targetCurrency: 'USD',
    });
    const convertedAmount = parseFloat(amount * usdConversion).toFixed(2);
    const feeConfig = await this.getFees({
    });
    const { isPercentage, onChainfee, value, minValue } = feeConfig;
    let fees = 0;
    if (isPercentage) {
      const calculatedFees = parseFloat((value * convertedAmount) / 100);
      fees = calculatedFees <= parseFloat(minValue) ? minValue : calculatedFees;
    } else {
      const convertedOnChainFees = usdConversion * onChainfee;
      fees = convertedOnChainFees + parseFloat(minValue);
    }
    const order = await pspOrdersService.create({
      customerId,
      amount,
      language,
      paymentGateway: 'FINITIC_PAY',
      gateway: 'FINITIC_PAY',
      paymentFor: wallet._id,
      paymentForModel: CONSTANTS.PAYMENT_FOR_MODELS.WALLET,
      currency: 'USD',
      note: note || 'Deposit',
      rate: usdConversion,
      convertedAmount,
      fees,
    });
    return order;
  }

  async handleCreateTradingAccountOrder(payload) {
    const {
      tradingAccountId,
      amount,
      customerId,
      language = 'en-gb',
      note,
    } = payload;
    const usdConversion = await conversionRateService.getConversionRate({
      baseCurrency: 'USD',
      targetCurrency: 'USDT',
    });
    const convertedAmount = parseFloat(amount * usdConversion).toFixed(2);
    const feeConfig = await this.getFees({
    });
    const { isPercentage, onChainfee, value, minValue } = feeConfig;
    let fees = 0;
    if (isPercentage) {
      const calculatedFees = parseFloat((value * convertedAmount) / 100);
      fees = calculatedFees <= parseFloat(minValue) ? minValue : calculatedFees;
    } else {
      const convertedOnChainFees = usdConversion * onChainfee;
      fees = convertedOnChainFees + parseFloat(minValue);
    }
    const order = await pspOrdersService.create({
      customerId,
      amount,
      language,
      paymentGateway: 'FINITIC_PAY',
      gateway: 'FINITIC_PAY',
      paymentFor: tradingAccountId,
      paymentForModel: CONSTANTS.PAYMENT_FOR_MODELS.TRADING_ACCOUNT,
      currency: 'USD',
      note: note || 'Deposit',
      rate: 1,
      convertedAmount: amount,
      fees,
    });
    return order;
  }

  async pay(params, user) {
    const {
      tradingAccountId,
      walletId,
      amount,
      note,
      language = 'en-gb',
      // paymentPayload,
    } = params;
    const {
      _id: customerId,
    } = user;
    let order;
    if (walletId) {
      order = await this.handleCreateWalletOrder({
        walletId,
        amount,
        customerId,
        language,
        note,
      });
    } else if (tradingAccountId) {
      order = await this.handleCreateTradingAccountOrder({
        tradingAccountId,
        amount,
        customerId,
        language,
        note,
      });
    }
    console.log(`Preparing data for finitic pay: ${JSON.stringify(order)}`);
    const data = {
      merchantId: finiticPay.merchantId,
      amount: order.convertedAmount,
      currency: order.currency,
      returnUrl: frontendRedirectUrl,
      callbackUrl: `${backendURL}api/v1/cp/psp/finitic-pay/webhook/${order._id}`,
    };
    console.log(`Calling finitic pay: ${JSON.stringify(data)}`);
    const request = {
      method: 'post',
      url: `${finiticPay.depositUrl}/cp/psp/finitic-pay/pay`,
      data,
    };
    console.log(`Reqst finitic pay: ${JSON.stringify(request)}`);
    const resp = await fp.post('/cp/psp/finitic-pay/pay', data).catch((e) => {
      console.log(e);
      logger.error(`[${LOG_TAG}][createCheckoutItem]${e.message}`);
    });
    logger.info(`response, ${JSON.stringify(resp.data)}`);
    if (resp && resp.data.result.url) {
      pspOrdersService.updateById(order._id, {
        'dataPrimary.checkoutUrl': resp.data.result.url,
      });
      return {
        url: resp.data.result.url,
      };
    }
    throw new Error('Error authenticating checkout');
  }

  async handlePaidOrder(order, params) {
    const {
      type,
    } = params;
    pspOrdersService.markPaid(order._id);
    // convert the amount to wallet amount.
    if (type === 'WALLET') {
      const { rate } = order;
      const convertedPaidAmount = parseFloat(params.paidAmount / rate).toFixed(2);
      const convertedFees = parseFloat(params.fee / rate).toFixed(2);
      // check if the order is already created
      const transaction = await transactionService.findOne({
        gateway: 'FINITIC_PAY',
        txId: order._id?.toString(),
      });
      if (transaction) {
        return transactionService.updateGatewayDeposit({
          txId: order._id?.toString(),
          paid: parseFloat(convertedPaidAmount - convertedFees),
          amount: parseFloat(convertedPaidAmount - convertedFees),
          fees: convertedFees,
          currency: params.currency,
          status: 'APPROVED',
        });
      }
      return transactionService.createGatewayDeposit({
        walletId: params.walletId,
        amount: parseFloat(convertedPaidAmount - convertedFees),
        paid: parseFloat(convertedPaidAmount - convertedFees),
        currency: params.currency,
        status: 'APPROVED',
        gateway: 'FINITIC_PAY',
        txId: order._id?.toString(),
        fees: parseFloat(convertedFees),
      }, {
        orderId: order._id,
      });
    }
    if (type === 'FX') {
      // check if the order is already created
      const transaction = await fxTransactionService.findOne({
        gateway: 'FINITIC_PAY',
        txId: order._id?.toString(),
      });
      if (transaction) {
        return fxTransactionService.updateGatewayDeposit({
          txId: order._id,
          paid: params.paidAmount - params.fee,
          amount: params.paidAmount - params.fee,
          currency: params.currency,
          status: 'APPROVED',
          fee: params.fee,
        });
      }
      return fxTransactionService.createGatewayDeposit({
        tradingAccountId: params.tradingAccountId,
        amount: params.paidAmount - params.fee,
        paid: params.paidAmount - params.fee,
        currency: params.currency,
        status: 'APPROVED',
        gateway: 'FINITIC_PAY',
        txId: order._id?.toString(),
        fee: parseFloat(params.fee),
      }, {
        orderId: order._id,
      });
    }
  }

  async handlePartiallyPaidOrder(order, params) {
    const {
      type,
    } = params;
    // convert the amount to wallet amount.
    pspOrdersService.markPartialPaid(order._id);
    if (type === 'WALLET') {
      const { rate } = order;
      const convertedPaidAmount = parseFloat(params.paidAmount / rate).toFixed(2);
      const transaction = await transactionService.findOne({
        gateway: 'FINITIC_PAY',
        txId: order._id?.toString(),
      });
      if (transaction) {
        return transactionService.updateGatewayDeposit({
          txId: order._id?.toString(),
          paid: convertedPaidAmount,
          amount: params.amount,
          currency: params.currency,
          status: 'PENDING',
        });
      }
      return transactionService.createGatewayDeposit({
        walletId: params.walletId,
        amount: params.amount,
        paid: convertedPaidAmount,
        currency: params.currency,
        status: 'PENDING',
        gateway: 'FINITIC_PAY',
        txId: order._id?.toString(),
      }, {
        orderId: order._id,
      });
    }
    if (type === 'FX') {
      const transaction = await fxTransactionService.findOne({
        gateway: 'FINITIC_PAY',
        txId: order._id?.toString(),
      });
      if (transaction) {
        return fxTransactionService.updateGatewayDeposit({
          txId: order._id?.toString(),
          paid: params.paidAmount,
          amount: params.amount,
          currency: params.currency,
          status: 'PENDING',
        });
      }
      return fxTransactionService.createGatewayDeposit({
        tradingAccountId: params.tradingAccountId,
        amount: params.amount,
        paid: params.paidAmount,
        currency: params.currency,
        status: 'PENDING',
        gateway: 'FINITIC_PAY',
        txId: order._id?.toString(),
      }, {
        orderId: order._id,
      });
    }
  }

  async handleCancelledOrder(order, params) {
    const {
      type,
    } = params;
    const isCancelled = params.paidAmount === 0;
    if (!isCancelled) {
      return this.handlePaidOrder(order, params);
    }
    // convert the amount to wallet amount.
    if (type === 'WALLET') {
      const transaction = await transactionService.findOne({
        gateway: 'FINITIC_PAY',
        txId: order._id?.toString(),
      });
      if (transaction) {
        return transactionService.updateGatewayDeposit({
          txId: order._id?.toString(),
          amount: params.amount,
          paid: 0,
          currency: params.currency,
          status: 'REJECTED',
        });
      }
      return transactionService.createGatewayDeposit({
        walletId: params.walletId,
        amount: params.amount,
        paid: params.paidAmount,
        currency: params.currency,
        status: 'REJECTED',
        gateway: 'FINITIC_PAY',
        txId: order._id?.toString(),
      }, {
        orderId: order._id,
      });
    }
    if (type === 'FX') {
      const transaction = await fxTransactionService.findOne({
        gateway: 'FINITIC_PAY',
        txId: order._id?.toString(),
      });
      if (transaction) {
        //  UPDATE THE TRANSACTION AND PAY THE AMOUNT
        return fxTransactionService.updateGatewayDeposit({
          txId: order._id,
          amount: params.amount,
          paid: 0,
          currency: params.currency,
          status: 'REJECTED',
        });
      }
      return fxTransactionService.createGatewayDeposit({
        tradingAccountId: params.tradingAccountId,
        amount: params.amount,
        paid: params.paidAmount,
        currency: params.currency,
        status: 'REJECTED',
        gateway: 'FINITIC_PAY',
        txId: order._id?.toString(),
      }, {
        orderId: order._id,
      });
    }
    return pspOrdersService.markCancelled(order._id);
  }
  async createPspOrder(params) {
    const {
      tradingAccountId,
      walletId,
      amount,
      note,
      language = 'en-gb',
    } = params;
    let order;
    if (walletId) {
      order = await this.handleCreateWalletOrder({
        walletId,
        amount,
        note,
        language,
      });
    } else if (tradingAccountId) {
      order = await this.handleCreateTradingAccountOrder({
        tradingAccountId,
        amount,
        note,
        language,
      });
    }
    const callbackUrl = `${backendURL}api/v1/cp/psp/finitic-pay/webhook/${order._id}`;
    return {order ,callbackUrl};;
  }
  async handleExpiredOrder(order, params) {
    const {
      type,
    } = params;
    const isCancelled = params.paidAmount === 0;
    if (!isCancelled) {
      return this.handlePaidOrder(order, params);
    }
    // convert the amount to wallet amount.
    if (type === 'WALLET') {
      const transaction = await transactionService.findOne({
        gateway: 'FINITIC_PAY',
        txId: order._id?.toString(),
      });
      if (transaction) {
        //  UPDATE THE TRANSACTION AND PAY THE AMOUNT
        return transactionService.updateGatewayDeposit({
          txId: order._id?.toString(),
          amount: params.amount,
          paid: 0,
          currency: params.currency,
          status: 'REJECTED',
        });
      }
      return transactionService.createGatewayDeposit({
        walletId: params.walletId,
        amount: params.amount,
        paid: params.paidAmount,
        currency: params.currency,
        status: 'REJECTED',
        gateway: 'FINITIC_PAY',
        txId: order._id?.toString(),
      }, {
        orderId: order._id,
      });
    }
    if (type === 'FX') {
      const transaction = await fxTransactionService.findOne({
        gateway: 'FINITIC_PAY',
        txId: order._id?.toString(),
      });
      if (transaction) {
        //  UPDATE THE TRANSACTION AND PAY THE AMOUNT
        return fxTransactionService.updateGatewayDeposit({
          txId: order._id?.toString(),
          amount: params.amount,
          paid: 0,
          currency: params.currency,
          status: 'REJECTED',
        });
      }
      return fxTransactionService.createGatewayDeposit({
        tradingAccountId: params.tradingAccountId,
        amount: params.amount,
        paid: params.paidAmount,
        currency: params.currency,
        status: 'REJECTED',
        gateway: 'FINITIC_PAY',
        txId: order._id?.toString(),
      }, {
        orderId: order._id,
      });
    }
    return pspOrdersService.markCancelled(order._id);
  }

  async paymentStatus(orderId, params) {
    logger.info(`${LOG_TAG} paymentStatus, ${JSON.stringify(params)}`);
    // actually need to store this in the db
    const {
      amount,
      paidAmount,
      status,
      currency,
      fee,
    } = params;
    const order = await pspOrdersService.findById(orderId, {}, true, [{
      path: 'paymentFor',
      select: 'asset belongsTo',
    }]);
    if (!order) {
      return {
        status: 'FAILED',
        orderId: order._id,
        message: 'Order not found',
      };
    }
    if (['CANCELLED', 'EXPIRED', 'PAID'].includes(order.status)) {
      return {
        status: 'FAILED',
        orderId: order._id,
        message: `Order is already ${status}`,
      };
    }
    const {
      paymentFor,
      paymentForModel,
    } = order;
    const type = paymentForModel === 'wallet' ? 'WALLET' : 'FX';
    switch (status) {
      case 'UNPAID':
        console.log('Order is unpaid: ', params);
        break;
      case 'PAID':
        return this.handlePaidOrder(order, {
          type,
          amount,
          paidAmount,
          currency,
          fee,
          [type === 'WALLET' ? 'walletId' : 'tradingAccountId']: paymentFor._id,
        });
      case 'PARTIALPAID':
        return this.handlePartiallyPaidOrder(order, {
          type,
          amount,
          paidAmount,
          currency,
          [type === 'WALLET' ? 'walletId' : 'tradingAccountId']: paymentFor._id,
        });
      case 'CANCELLED':
        return this.handleCancelledOrder(order, {
          type,
          amount,
          paidAmount,
          currency,
          [type === 'WALLET' ? 'walletId' : 'tradingAccountId']: paymentFor._id,
        });
      case 'EXPIRED':
        return this.handleExpiredOrder(order, {
          type,
          amount,
          paidAmount,
          currency,
          [type === 'WALLET' ? 'walletId' : 'tradingAccountId']: paymentFor._id,
        });
      default:
        console.log(`Unknown status ${status}: `, params);
        break;
    }
    return {
      status: 'FAILED',
      orderId: order._id,
      message: 'Unknown status received',
    };
  }

  async getFees({
    currency = 'USDT',
  }) {
    try {
      const response = await axios.get(`${finiticPay.depositUrl}/cp/psp/finitic-pay/fees-preview?currency=${currency}`, {
        headers: {
          'Content-Type': 'application/json',
          'merchant-id': finiticPay.merchantId,
        },
      });
      return response.data.result;
    } catch (error) {
      logger.error(error.stack);
      throw new Error('ERROR GETTING FEES');
    }
  }
}

module.exports = new FiniticPayService();
