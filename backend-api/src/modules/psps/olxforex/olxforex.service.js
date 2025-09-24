const { olxforex } = require('src/common/data').keys;
const axios = require('axios');
const {
  pspOrdersService,
  transactionService,
  walletService,
  conversionRateService,
} = require('src/modules/services');
const { logger } = require('src/common/lib');

const LOG_TAG = 'OLXFOREX_SERVICE';

class OlxforexService {
  async pay(params, user) {
    const {
      walletId,
      amount,
      note,
      language = 'en-gb',
    } = params;
    const {
      _id: customerId,
    } = user;
    const wallet = await walletService.findById(walletId);
    const usdConversion = await conversionRateService.getConversionRate({
      baseCurrency: wallet.asset,
      targetCurrency: 'USD',
    });
    const convertedAmount = (amount * usdConversion).toFixed(2);
    const order = await pspOrdersService.create({
      customerId,
      amount,
      language,
      paymentGateway: 'OLX_FOREX',
      paymentFor: walletId,
      paymentForModel: 'wallet',
      currency: wallet.asset,
      note: note || 'Deposit',
      rate: usdConversion,
      convertedAmount,
    });
    const data = {
      amount: convertedAmount,
    };
    const request = {
      method: 'post',
      url: olxforex.depositUrl,
      headers: {
        Authorization: olxforex.apiKey,
        'X-Merchant-Name': olxforex.merchantId,
        'X-Transaction': order._id.toString(),
      },
      data,
    };
    console.log('headers', request.headers);
    console.log('data', request.data);
    const resp = await axios(request).catch((e) => {
      logger.error(`[${LOG_TAG}][createCheckoutItem]${e.message}`);
    });
    logger.info(`response, ${JSON.stringify(resp.data)}`);
    if (resp && resp.data.url) {
      pspOrdersService.updateById(order._id, {
        'dataPrimary.checkoutUrl': resp.data.url,
      });
      return {
        url: resp.data.url,
      };
    }
    throw new Error('Error authenticating checkout');
  }

  async paymentStatus(params) {
    logger.info(`${LOG_TAG} paymentStatus, ${JSON.stringify(params)}`);
    const {
      type,
      message,
      number,
      transaction,
    } = params;
    const order = await pspOrdersService.findById(number, {}, true, [{
      path: 'paymentFor',
      select: 'asset belongsTo isCrypto',
    }]);
    if (!order) {
      return {
        status: 'FAILED',
        orderId: order._id,
        message: 'Order not found',
      };
    }
    if (order.status !== 'UNPAID') {
      return {
        status: 'FAILED',
        orderId: order._id,
        message: `Order is already ${order.status}`,
      };
    }
    if (type === 'success') {
      const {
        amount,
        paymentFor,
        paymentForModel,
      } = order;
      if (paymentForModel === 'wallet') {
        const wallet = await walletService.findById(paymentFor._id);
        if (!wallet) {
          throw new Error('Wallet not found');
        }
        const resTransRes = await transactionService.createPendingTransaction('DEPOSIT', {
          customerId: order.customerId,
          walletId: wallet._id,
          currency: wallet.asset,
          gateway: 'OLX_FOREX',
          amount,
        });
        logger.info(`${LOG_TAG}: Deposit transaction response, orderId: ${order._id}, ${JSON.stringify(resTransRes)}`);
        await pspOrdersService.markPaid(order._id);
        logger.info(`${LOG_TAG}: Order marked paid, orderId: ${order._id}`);
        await pspOrdersService.updateById(order._id, {
          dataPrimary: {
            ...order.dataPrimary,
            type,
            message,
            number,
            transaction,
          },
          transactionCreated: true,
        });
        return {
          status: 'SUCCESS',
          orderId: order._id,
        };
      }
      await pspOrdersService.markFailed(order._id, 'For Model not supported');
    }
    if (type === 'canceled') {
      await pspOrdersService.markCancelled(order._id);
      logger.info(`${LOG_TAG}: Order marked cancelled, orderId: ${order._id}`);
      await pspOrdersService.updateById(order._id, {
        dataPrimary: {
          ...order.dataPrimary,
          type,
          message,
          number,
          transaction,
        },
      });
      return {
        status: 'CANCELLED',
        orderId: order._id,
      };
    }
    await pspOrdersService.markFailed(order._id, `Message is ${message}`);
    logger.info(`${LOG_TAG}: Order marked failed, orderId: ${order._id}`);
    return {
      status: 'FAILED',
      orderId: order._id,
      message: `Message is ${message}`,
    };
  }
}

module.exports = new OlxforexService();
