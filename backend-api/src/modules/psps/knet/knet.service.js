
/* eslint-disable class-methods-use-this */
const { logger } = require('src/common/lib');
const axios = require('axios');
const { knet, frontendRedirectUrl } = require('src/common/data').keys;
const crypto = require('crypto');

class KnetService {
  async createAccessToken() {
    const data = {
      ClientId: knet.clientId,
      ClientSecret: knet.clientSecret,
      ENCRP_KEY: knet.encryptKey,
    };
    const buff = new Buffer(`${knet.clientId}:${knet.clientSecret}`);
    const base64data = buff.toString('base64');
    const request = {
      method: 'post',
      url: `${knet.url}${knet.getAuthTokenUrl}`,
      headers: {
        Authorization: `Basic ${base64data}`,
        'Content-Type': 'application/json',
      },
      data,
    };
    const resp = await axios(request).catch((e) => {
      logger.error(`[KnetService][createCheckoutItem]${e.message}`);
      console.log('error', e.response);
      throw new Error(e.message);
    });
    return resp.data;
  }
  
  async createCheckoutItem(order, params) {
    const {gatewayValue:rateAmount}  = params

    const amount = parseFloat(order.amount).toFixed(3);
    const orderCurrency = order.currency;
    const convertedAmount = parseFloat(amount * rateAmount).toFixed(3);
    console.log('converted amount', convertedAmount);
    const data = {
      ClientId: knet.clientId,
      ClientSecret: knet.clientSecret,
      ENCRP_KEY: knet.encryptKey,
    };
    const buff = new Buffer(`${knet.clientId}:${knet.clientSecret}`);
    const base64data = buff.toString('base64');
    console.log('base64data', base64data);
    const request = {
      method: 'post',
      url: `${knet.url}${knet.getAuthTokenUrl}`,
      headers: {
        Authorization: `Basic ${base64data}`,
        'Content-Type': 'application/json',
      },
      data,
    };
    console.log('request', request);
    const resp = await axios(request).catch((e) => {
      logger.error(`[KnetService][createCheckoutItem]${e.message}`);
      console.log('error', e.response);
    });
    console.log('response', resp.data);
    if (resp && resp.data.Status && resp.data.Status === '1') {
      return {
        checkoutId: resp.data.AccessToken,
        orderId: order._id.toString(),
        result: resp.data.Status,
        order: {
          tij_MerchantPaymentTrack: order._id.toString(),
          tij_MerchantPaymentAmount: convertedAmount,
          tij_MerchantPaymentCurrency: 'KWD',
          tij_MerchantPaymentRef: `Payment For MT5 00000`,
          tij_MerchAuthKeyApi: resp.data.AccessToken,
          tij_MerchReturnUrl: `${knet.backendPaymentVerifyUrl}/${order._id.toString()}`,
        },
      };
    }
    throw new Error('Error authenticating checkout');
  }

  async verifyPayment(orderId, accessToken) {
    return new Promise(async (resolve, reject) => {
      const accToken = await this.createAccessToken();
      if (accToken && accToken.AccessToken) {
        accessToken = accToken.AccessToken;
      }
      const buff = new Buffer(`${knet.clientId}:${knet.clientSecret}`);
      const base64data = buff.toString('base64');
      const data = {
        encrypmerch: knet.encryptKey,
        authkey: accessToken,
        payid: orderId.toString(),
      };
      const request = {
        method: 'post',
        url: `${knet.url}${knet.paymentVerificationUrl}`,
        headers: {
          Authorization: `Basic ${base64data}`,
          'Content-Type': 'application/json',
        },
        data,
      };
      console.log(request);
      const resp = await axios(request).catch((e) => { logger.error(`[KnetService][verifyPayment]${e.message}`); console.log(e); });
      console.log(resp.data);
      if (resp && resp.data.Status && resp.data.Status === '1') {
        return resolve({ result: resp.data, accessToken });
      }
      if (resp && resp.data.Status) {
        return resolve({ result: resp.data, accessToken });
      }
      return reject(new Error('Error fetching payment result item.'));
    });
  }

  getErrorDetails(errorCode) {
    switch (errorCode) {
      case 'TIJ0001':
        return 'Invalid Merchant Language ';
      case 'TIJ0002':
        return 'Invalid Merchant Amount';
      case 'TIJ0003':
        return 'Invalid Merchant Amount KWD';
      case 'TIJ0004':
        return 'Invalid Merchant Track ID ';
      case 'TIJ0005':
        return 'Invalid Merchant UDF1 ';
      case 'TIJ0015':
        return 'Invalid Merchant UDF2';
      case 'TIJ0006':
        return 'Invalid Merchant Currency';
      case 'TIJ0007':
        return 'Invalid Merchant Payment reference';
      case 'TIJ0008':
        return 'Invalid Merchant Pay Type';
      case 'TIJ0009':
        return 'Invalid Merchant API Authenticate Key';
      case 'TIJ0016':
        return 'Error in QR';
      case 'TIJ0020':
        return 'Error in KNET';
      case 'TIJ0022':
        return 'Invalid Merchant UDF3';
      case 'TIJ0023':
        return 'Invalid Merchant UDF4';
      case 'TIJ0024':
        return 'Invalid Merchant UDF5';
      case 'TIJ0027':
        return 'Invalid Merchant Return URL';
      default:
        return errorCode;
    }
  }
 
}

module.exports = new KnetService();

