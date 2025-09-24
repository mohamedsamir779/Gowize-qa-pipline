/* eslint-disable class-methods-use-this */
const axios = require('axios');
const qs = require('qs');

const { logger } = require('src/common/lib');
const { netellerPaySafe } = require('src/common/data').keys;
const request = require('request');
const {
  CustomError
} = require('src/common/handlers');


class NetellerService {
  async createPaymentHandle(order,params) {
    const {email, amount} = params
    const myOrder = await this.getOrder(email, order._id.toString(), amount);
    return new Promise((resolve, reject) => {
      request({
        method: 'POST',
        url: netellerPaySafe.paysafeOrderUrl,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${this.getToken()}`,
          Simulator: '\'EXTERNAL\'',
        },
        body: JSON.stringify(myOrder),
      }, (error, response, body) => {
        if (error) {
          logger.error(`[NetellerService][]createOrder${error}`);
          return reject(error);
        }
        if (body.error) {
          return reject(new Error(body.error.message));
        }
        return resolve(JSON.parse(body));
      });
    });
  }

  getToken() {
    const credentials = `${netellerPaySafe.paysafeApiUsername}:${netellerPaySafe.paysafeApiPassword}`;
    // eslint-disable-next-line no-buffer-constructor
    const buff = new Buffer(credentials);
    const token = buff.toString('base64');
    return token;
  }

  async getOrder(netellerEmail, transactionId, amount) {
    const chiperText = transactionId;

    return {
      merchantRefNum: transactionId,
      transactionType: 'PAYMENT',
      neteller: {
        consumerId: netellerEmail,
        consumerIdLocked: false,
        detail1Description: netellerPaySafe.itemDescription,
        detail1Text: netellerPaySafe.itemName,
      },
      paymentType: 'NETELLER',
      amount: amount * 100,
      currencyCode: 'USD',    
      returnLinks: [
        { rel: 'on_completed', href: `${netellerPaySafe.successUrl}?orderId=${transactionId}&netellerRes=0`, method: 'post' },
        { rel: 'on_failed', href: `${netellerPaySafe.failureUrl}?orderId=${transactionId}&netellerRes=1`, method: 'post' },
        { rel: 'default', href: `${netellerPaySafe.cancelUrl}?orderId=${transactionId}&netellerRes=2`, method: 'post' },
      ],
    };
  }
  
  async getOrderStatusFromPaysafe(orderId, isMerchantRef = false) {
    return new Promise((resolve, reject) => {
      let params = '';
      if (isMerchantRef === true) {
        params = `?merchantRefNum=${orderId}`;
      } else {
        params = `/${orderId}`;
      }
      const url = `${netellerPaySafe.paysafeOrderUrl}${params}`;
      request({
        method: 'GET',
        url,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${this.getToken()}`,
          // Simulator: '\'EXTERNAL\'',
        },
      }, (error, response, body) => {
        if (error) {
          return reject(error);
        }
        const output = JSON.parse(body);

        if (output.error) {
          return reject(new Error({ ...output.error, code: 404 }));
        }
        return resolve(output);
      });
    });
  }
  async makePayment(params = {}) {
    const {
      merchantRefNum, amount, currencyCode, paymentHandleToken,
    } = params;
    return new Promise((resolve, reject) => {
      const url = netellerPaySafe.paysafePaymentUrl;
      request({
        method: 'POST',
        url,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${this.getToken()}`,
          // Simulator: '\'EXTERNAL\'',
        },
        body: JSON.stringify({
          merchantRefNum,//: 'asdfasd8f9asdf98as7d98f7sad98fasdfa',
          amount,
          currencyCode,
          paymentHandleToken,
          dupCheck: true,
          settleWithAuth: true,
        }),
      }, (error, response, body) => {
        if (error) {
          return reject(error);
        }
        const output = JSON.parse(body);

        if (output.error) {
          return reject(new CustomError({ ...output.error, code: 404 }));
        }
        return resolve(output);
      });
    });
  }
}

module.exports = new NetellerService();

