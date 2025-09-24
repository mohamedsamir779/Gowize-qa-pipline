/* eslint-disable class-methods-use-this */
const axios = require('axios');
const qs = require('qs');

const { logger } = require('src/common/lib');
const { mastercard } = require('src/common/data').keys;

class MastercardService {
  async createCheckoutItem(order, params, rateAmount = 0.31) {
    const amount = parseFloat(order.amount).toFixed(2);
    const orderCurrency = order.currency;
    const convertedAmount = parseFloat(order.amount) * rateAmount;
    const data = {
      apiOperation: mastercard.createCheckoutApiOperation,
      interaction: {
        operation: mastercard.purchaseInteractionOperation,
        cancelUrl: `${mastercard.frontendDepositUrl}`,
        returnUrl: `${mastercard.frontendDepositUrl}`,
      },
      order: {
        id: order._id.toString(),
        reference: `${order._id}`,
        amount: convertedAmount,
        currency: 'KWD',
        description: `Payment For ${order._id}`,
      },
      transaction: {
        reference: `${order._id}`,
      },
    };
    const buff = new Buffer(`merchant.${mastercard.merchant}:${mastercard.apiPassword}`);
    const base64data = buff.toString('base64');
    const request = {
      method: 'post',
      url: `${mastercard.url}/merchant/${mastercard.merchant}/session`,
      headers: {
        Authorization: `Basic ${base64data}`,
        'Content-Type': 'application/json',
      },
      data,
    };
    const resp = await axios(request).catch((e) => {
      logger.error(`[MastercardService][createCheckoutItem]${e.message}`);
    });
    if (resp && resp.data.result && resp.data.result === 'SUCCESS' && resp.data.merchant === mastercard.merchant) {
      return {
        checkoutId: resp.data.session.id,
        result: resp.data.result,
      };
    }
    throw new Error('Error creating checkout');
  }

  async verifyPayment(orderId) {
    return new Promise(async (resolve, reject) => {
      const buff = new Buffer(`merchant.${mastercard.merchant}:${mastercard.apiPassword}`);
      const base64data = buff.toString('base64');
      const request = {
        method: 'get',
        url: `${mastercard.url}/merchant/${mastercard.merchant}/order/${orderId}`,
        headers: {
          Authorization: `Basic ${base64data}`,
          'Content-Type': 'application/json',
        },
      };
      const resp = await axios(request).catch((e) => { logger.error(`[MastercardService][verifyPayment]${e.message}`); });
      if (resp && resp.data.result === 'SUCCESS') {
        return resolve({ result: resp.data.result, id: resp.data.id });
      }
      return reject(new Error('Error fetching checkout item.'));
    });
  }
}

module.exports = new MastercardService();

