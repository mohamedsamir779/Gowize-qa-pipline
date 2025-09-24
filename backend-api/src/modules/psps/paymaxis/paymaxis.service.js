const { paymaxis, backendURL } = require('src/common/data').keys;
const axios = require('axios');
const {
  pspOrdersService,
  transactionService,
  walletService,
  fxTransactionService,
  accountService,
  conversionRateService,
  customerService,
  dictionaryService
} = require('src/modules/services');
const { logger } = require('src/common/lib');
const LOG_TAG = 'PAYMAXIS_SERVICE';

// let dictonaryService;

class PaymaxisService {
  async pay(params, user) {
    const {
      tradingAccountId,
      walletId,
      amount,
      note,
      language = 'en-gb',
      paymentPayload,
    } = params;
    let order;
    let paymentFor;
    let convertedAmount;
    
    const {
      card,
    } = paymentPayload;
    const {
      _id: customerId,
    } = user;
    if (walletId) {
      paymentFor = walletId;
      const wallet = await walletService.findById(walletId);
      const usdConversion = await conversionRateService.getConversionRate({
        baseCurrency: wallet.asset,
        targetCurrency: 'USD',
      });
      convertedAmount = (amount * usdConversion).toFixed(2);
      order = await pspOrdersService.create({
        customerId,
        amount,
        language,
        paymentGateway: 'PAYMAXIS',
        paymentFor,
        paymentForModel: 'wallet',
        currency: wallet.asset,
        note: note || 'Deposit',
        rate: usdConversion,
        convertedAmount,
      });
    } else if (tradingAccountId) {
      paymentFor = tradingAccountId;
      convertedAmount = amount;
      order = await pspOrdersService.create({
        customerId,
        amount,
        language,
        paymentGateway: 'PAYMAXIS',
        paymentFor,
        paymentForModel: 'TradingAccount',
        currency: 'USD',
        note: note || 'Deposit',
        rate: 1,
        convertedAmount,
      });
    }
    const customer = await customerService.findOne({
      _id: customerId,
    });
    const countries = await dictionaryService.listCountries();
    const country = countries.find((c) => c?.en?.toLowerCase() === customer?.country?.toLowerCase());
    if (!country) {
      throw new Error('cant find this country');
    }
    const data = {
      referenceId: order._id,
      paymentType: 'DEPOSIT',
      currency: 'USD',
      description: `Deposit to ${paymentFor} `,
      amount: convertedAmount,
      // card,
      customer: {
        referenceId: customerId,
        email: customer.email,
      },
      billingAddress: {
        countryCode: country?.alpha2?.toUpperCase(),
      },
      returnUrl: `https://my.gowize.co/api/v1/cp/psp/paymaxis/payment-status?txId=${order._id}`,
      // eslint-disable-next-line quotes
      webhookUrl: `https://my.gowize.co/api/v1/cp/psp/paymaxis/status`,
      startRecurring: false,
    };
    console.log(`Sending Data for ${customerId},`, data);
    const paymentRequest = {
      method: 'post',
      url: `${paymaxis.baseUrl}api/v1/payments`,
      headers: {
        Authorization: `Bearer ${paymaxis.apiKey}`,
      },
      data,
    };
    const resp = await axios(paymentRequest).catch((e) => {
      logger.error(`[${LOG_TAG}][createCheckoutItem]${e.message}`);
    });
    console.log(resp);
    logger.info(`response, ${JSON.stringify(resp.data)}`);
    if (resp && resp.data.status === 200) {

      pspOrdersService.updateById(order._id, {
        'dataPrimary.checkoutUrl': resp.data.result.redirectUrl,
      });
      return {
        url: resp.data.result.redirectUrl,
      };
    }
    throw new Error('Error authenticating checkout');
  }
  async paymentStatus(params) {
    logger.info(`${LOG_TAG} paymentStatus, ${JSON.stringify(params)}`);
    const {
      id,
      referenceId,
      state,
      externalRefs,
    } = params;
    const order = await pspOrdersService.findById(referenceId, {}, true, [{
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
    if (state === 'COMPLETED') {
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
          gateway: 'PAYMAXIS',
          amount,
        });
        await transactionService.updatePaymentStatus(resTransRes._id, {
          content: {
            txId: id,
            authTxGuid: externalRefs.authorizeTransactionGuid,
          },
        }, 'APPROVED');
        logger.info(`${LOG_TAG}: Deposit transaction response, orderId: ${order._id}, ${JSON.stringify(resTransRes)}`);
        await pspOrdersService.markPaid(order._id);
        logger.info(`${LOG_TAG}: Order marked paid, orderId: ${order._id}`);
        await pspOrdersService.updateById(order._id, {
          checkOutId: id,
          checkOUtId2: externalRefs.authorizedTransactionId,
          dataPrimary: {
            ...order.dataPrimary,
            ...params,
          },
          transactionCreated: true,
        });
        return {
          status: 'SUCCESS',
          orderId: order._id,
        };
      }
      const account = await accountService.findById(paymentFor._id);
      const transObj = await fxTransactionService.addApprovedDeposit({
        customerId: account.customerId,
        accountId: account._id,
        currency: account.currency,
        gateway: 'PAYMAXIS',
        amount,
        tradingAccountId: account._id,
        note: 'Deposit from Paymaxis by Client',
      }, account, {
        txId: id,
        authTxGuid: externalRefs.authorizeTransactionGuid,
      });
      if (transObj) {
        logger.info(`${LOG_TAG}: Deposit transaction response, orderId: ${order._id}, ${JSON.stringify(transObj)}`);
        await pspOrdersService.markPaid(order._id);
        logger.info(`${LOG_TAG}: Order marked paid, orderId: ${order._id}`);
        await pspOrdersService.updateById(order._id, {
          checkOutId: id,
          checkOUtId2: externalRefs.authorizedTransactionId,
          dataPrimary: {
            ...order.dataPrimary,
            ...params,
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
    await pspOrdersService.markFailed(order._id, `Message is ${JSON.stringify(externalRefs)}`);
    return {
      status: 'FAILED',
      orderId: order._id,
      message: 'Unknown status received',
    };
  }
  async getOrder(id) {
    const order = await pspOrdersService.findById(id);
    return order;
  }
}
module.exports = new PaymaxisService();

// setTimeout(() => {
//   const services = require('src/modules/services');
//   dictionaryService = services.dictionaryService;
// }, 0);