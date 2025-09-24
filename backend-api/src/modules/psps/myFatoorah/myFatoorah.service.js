
/* eslint-disable class-methods-use-this */
const { logger } = require('src/common/lib');
const request =  require('request')
const { myfatoorah, frontendRedirectUrl } = require('src/common/data').keys;
const crypto = require('crypto');

class MyFatoorahService {
  async initiatePayment() {
    return new Promise((resolve, reject) => {
      request({
        method: 'POST',
        url: `${myfatoorah.baseURL}${myfatoorah.initiatePayment}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${myfatoorah.authToken}`,
        },
        body: JSON.stringify({
          InvoiceAmount: 0,
          CurrencyIso: myfatoorah.currency,
        }),
      }, (error, response, body) => {
        if (error) {
          logger.error(`[MyFatoorahService][]MyFatoorahPay${error}`);
          return reject(error);
        }
        return resolve(JSON.parse(body).Data);
      });
    });
  }

  async executePayment(order,params) {
    return new Promise((resolve, reject) => {
      const {_id} = order
      const { paymentMethodId:PaymentMethodId, amount:InvoiceValue} = params

      request({
        method: 'POST',
        url: `${myfatoorah.baseURL}${myfatoorah.executePayment}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${myfatoorah.authToken}`,
        },
        body: JSON.stringify({
          PaymentMethodId,
          InvoiceValue,
          CustomerReference: _id.toString(),
          //UserDefinedField,
          CallbackUrl:myfatoorah.successUrl,
          ErrorUrl:myfatoorah.failureUrl,
        }),
      }, (error, response, body) => {
        if (error) {
          logger.error(`[MyFatoorahService][]MyFatoorahPay${error}`);
          return reject(error);
        }
				console.log('testing', body)
        return resolve(JSON.parse(body).Data);
      });
    });
  }


  async getPaymentStatus(Key, KeyType = 'PaymentId') {
    return new Promise((resolve, reject) => {
    request({
      method: 'POST',
      url: `${myfatoorah.baseURL}${myfatoorah.paymentStatus}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${myfatoorah.authToken}`,
      },
      body: JSON.stringify({
        Key,
        KeyType,
      }),
    }, (error, response, body) => {
      if (error) {
        logger.error(`[MyFatoorahService][]MyFatoorahPay${error}`);
        return reject(error);
      }
      return resolve(JSON.parse(body).Data);
    });
  });
}
}

module.exports = new MyFatoorahService();

