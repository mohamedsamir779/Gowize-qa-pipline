/* eslint-disable class-methods-use-this */
const axios = require('axios');
const qs = require('qs');

const { logger } = require('src/common/lib');
const { walaoPay } = require('src/common/data').keys;
const request = require('request');
const {
  CustomError
} = require('src/common/handlers');


class WalaoPayService {

  createRequestBody(params) {
    const {
      amount,
      orderId,
      paymentDetails,
      customerDetails,
    } = params;
    const {
      firstName,
      lastName,
      email,
      phone,
    } = customerDetails;
    const queryData = {
      sid: paymentDetails.sid,
      firstname: firstName || "testFName",
      lastname: lastName || "testLName",
      email,
      phone: phone || '00971501234567',
      payby: 'p2p',
      tx_action: 'PAYMENT',
      successurl: `${walaoPay.callbackBaseUrl}/awe/success`,
      failureurl: `${walaoPay.callbackBaseUrl}/awe/failure`,
      postbackurl: `${walaoPay.callbackBaseUrl}/awe/postback`,
      'item_quantity[]': '1',
      'item_name[]': 'deposit',
      'item_no[]': '1',
      'item_desc[]': 'deposit',
      'item_amount_unit[]': `${amount}`,
      tid: orderId.toString(),
    };
    console.log(queryData);
    return qs.stringify(queryData);
  }

  async createDepositTransaction(order,params) {
    const {
      amount,
      accountNumber,
      language,
      applicationId,
      paymentCurrency,
      customerDetails,
      gatewayAmount,
      paymentDetails
    } = params;
    
    const requestBody = this.createRequestBody({
      ...params,
      orderId: order._id.toString(),
      paymentDetails,
      amount: gatewayAmount,
    });
    const headers = {
      'postman-token': '5f0bb440-3d1c-bc81-0072-59c318bd5b4d',
      'content-type': 'application/x-www-form-urlencoded',
      'cache-control': 'no-cache',
    };
    const options = {
      method: 'POST',
      port: null,
      headers,
    };
    const transactionResponse = await axios.post(
      walaoPay.aweUrl,
      requestBody, {
        options,
      });
    if (transactionResponse) {
      return transactionResponse.data;
    }
    return null;
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
  
  static decryptSuccessCallback(string, key = walaoPay.rCode) {
    const str = Buffer.from(string, 'base64').toString('binary');
    let result = '';
    for (let i = 0; i < str.length; i++) {
      const charCodePoint = str.codePointAt(i);
      let pos = i % key.length - 1;
      if (pos < 0) {
        pos = key.length + pos;
      }
      const keyCodePoint = key.codePointAt(pos);
      let x = charCodePoint - keyCodePoint;
      if (x < 0) {
        x *= -1;
      }
      const char = String.fromCodePoint(x);
      result += char;
    }
    const decodedData = new URLSearchParams(decodeURI(result));
    return {
      tid: decodedData.get('tid'),
      txid: decodedData.get('txid'),
      status: decodedData.get('status'),
      descriptor: decodedData.get('descriptor'),
      error: {
        response: decodedData.get('error[response]'),
        msg: decodedData.get('error[msg]'),
        code: decodedData.get('error[code]'),
        msgcode: decodedData.get('error[msgcode]'),
        sys: decodedData.get('error[sys]'),
        type: decodedData.get('error[type]'),
        info: decodedData.get('error[info]'),
      },
      amount: decodedData.get('amount'),
      sid: decodedData.get('sid'),
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

module.exports = new WalaoPayService();

