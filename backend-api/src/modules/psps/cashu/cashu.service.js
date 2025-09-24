/* eslint-disable class-methods-use-this */
const { logger } = require('src/common/lib');
const { cashu } = require('src/common/data').keys;
const request = require('request');
const {
  CustomError,
  generateUuid
} = require('src/common/handlers');
const crypto = require('crypto');
const soap = require('soap');
const {
  PAYMENT_FAILURE
}  = require('./constants')


class CashuService {

  getSoapClient(urlVal) {
    return new Promise((resolve, reject) => {
      soap.createClient(urlVal, (err, client) => {
        if (err) {
          reject(err);
        }
        resolve(client);
      });
    });
  }
  
  createToken(amount) {
    const data = `${cashu.merchantID.toLowerCase()}:${amount}:${cashu.currency.toLowerCase()}:${cashu.encriptionKey}`;
    const token = crypto.createHash('md5').update(data).digest('hex');
    return token;
  }

  createUniqueId() {
    return generateUuid();
  }
 
  createSoapBody(reqBody) {
    const {
      amount, language,
    } = reqBody;
    const txId = this.createUniqueId();
    return {
      merchantID:cashu.merchantID,
      token: this.createToken(amount),
      displayText:cashu.displayText,
      soDisplayText:cashu.displayText,
      currency:cashu.currency,
      amount,
      language: language || 'en',
      sessionID: txId,
      soPeriod: '',
      txt1: txId,
      txt2: cashu.currency,
      txt3: '',
      txt4: '',
      txt5: '',
      testMode: 0,
      servicesName:cashu.servicesName,
      standingOrder: '',
      soTxt1: '',
      soTxt2: '',
      soTxt3: '',
    };
  }

  doPaymentRequest(soapClient, soapBody) {
    return new Promise((resolve, reject) => {
      soapClient.DoPaymentRequest(soapBody, (err, result) => {
        if (err) {
          reject(err);
        }
        logger.info(err, result);
        resolve(result);
      });
    });
  }

  async createPaymentHandle(order,params) {
    const scope = this;
    return new Promise(async (resolve, reject) => {
      try {
        const { language } = order
        const {email, amount} = params  
        const soapBody = this.createSoapBody({amount, language});
        const soapClient = await this.getSoapClient(cashu.url);
        const soapResult = await this.doPaymentRequest(soapClient, soapBody);
        const checkoutId = soapResult.DoPaymentRequestReturn.$value.split('=')[1];
        if (!checkoutId || checkoutId === undefined) {
          logger.error(`[CashuService][createTransactionCode] ${soapResult.DoPaymentRequestReturn.$value}`);
          return reject(new CustomError({
            message: soapResult.DoPaymentRequestReturn.$value, code: 501,
          }));
        }
        return resolve({ checkoutId, soapBody });
      } catch (error) {
        logger.error(`[CashuService][createTransactionCode]${error}`);
        return reject(new CustomError(PAYMENT_FAILURE, ...error));
      }
    });
  }

  async successCallback(order,reqBody) {
    const {
      verificationString, txt1, token, trn_id,
    } = reqBody;

    const verificationStringCompiled = `${cashu.merchantID.toLowerCase()}:${trn_id}:${cashu.encriptionKey}`;
    const calcVerificationStr = crypto.createHash('sha1').update(verificationStringCompiled).digest('hex');

    // const hashedVerificationString = crypto.createHash('sha1').
    // update(`${merchantID.toLowerCase()}:${txId}:${encriptionKey}`).digest('hex');

    if (calcVerificationStr !== verificationString) {
      logger.error('Verification code failed');
      throw new CustomError(PAYMENT_FAILURE);
    }
     if (!order) {
      logger.error('order not found!');
      throw new CustomError(PAYMENT_FAILURE);
    }
    if (this.createToken(order.amount) !== token) {
      logger.error('token is not matching!');
      throw new CustomError(PAYMENT_FAILURE);
    }
    return true;
  }

  async failedCallback(order,reqBody) {
    const { txt1 } = reqBody;
     if (!order) {
      logger.error('order not found!');
    }
    if (order.status === UNPAID) {
      await orderService.markFailed(order._id);
    }
    return true;
  }

}

module.exports = new CashuService();

