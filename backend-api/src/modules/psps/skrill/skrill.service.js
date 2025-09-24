/* eslint-disable class-methods-use-this */
const axios = require('axios');
const qs = require('qs');

const { logger } = require('src/common/lib');
const { skrill } = require('src/common/data').keys;
const request = require('request');
const {
  CustomError
} = require('src/common/handlers');


class SkrillService {
  async createPaymentHandle(order,params) {
    const {email, amount} = params

    return new Promise(async(resolve, reject) => {
      const skrillPayload = new URLSearchParams({
        prepare_only:1,
        amount:amount,
        recipient_description: skrill.receipentDesc,
        logo_url:  skrill.logo,
        pay_to_email:  skrill.payToEmail,
        status_url: skrill.statusUrl,
        status_url2: skrill.statusUrl2,
        language:  skrill.lang,
        payment_methods:  skrill.paymentMethods,
        currency:  skrill.currency,
        detail1_description:  skrill.detail1Desc,
        detail1_text:  skrill.detail1Text,
        return_url:  skrill.returnUrl,
        return_url_text:  skrill.returnBtnTxt,
        cId:  order.customerId.toString(),
        transaction_id: order._id.toString()
      }) 

      const request = {
        method: skrill.paymentMethod,
        url: skrill.paymentUrl,
         headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
         },
        data: skrillPayload,
      };
      
      const resp = await axios(request)
      if (resp.data) {
        resolve(resp.data)
      } else {
        reject("Something went wrong")
      }

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

module.exports = new SkrillService();

