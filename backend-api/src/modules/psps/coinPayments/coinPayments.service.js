/* eslint-disable class-methods-use-this */
const axios = require('axios');
const qs = require('qs');

const { logger } = require('src/common/lib');
const { coinPayments } = require('src/common/data').keys;
const request = require('request');
const {
  CustomError
} = require('src/common/handlers');


class CoinPaymentService {
  async createPaymentHandle(order,params) {
    const {email, user, amount} = params
    const customerId = user._id.toString()
    const ipn_url = `${coinPayments.ipnUrl}?orderId=${order._id}&customerId=${customerId}`; 
    const success_url = `${coinPayments.successUrl}?orderId=${order._id}&customerId=${customerId}`; 
    const cancel_url = `${coinPayments.cancelUrl}?orderId=${order._id}&customerId=${customerId}`;
    const invoice = `${order._id}__${customerId}`;
    return {
      merchant: coinPayments.merchant,
      ipn_url,
      success_url,
      cancel_url,
      item_name: `Deposit ${order.amount} USD For MT5 Account: 00000`,
      customerId,
     // firstName,
     // lastName,
      email,
      invoice,
      currency: order.currency,
      orderId: order._id,
   //  account: accountNumber,
      amount,
    };

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

module.exports = new CoinPaymentService();

