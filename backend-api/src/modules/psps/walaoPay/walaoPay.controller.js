/* eslint-disable class-methods-use-this */
const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');
const { logger } = require('src/common/lib');
const { walaoPay, frontendRedirectUrl } = require('src/common/data').keys;

const {
  pspOrdersService,
  transactionService,
  walletService,
} = require('src/modules/services');

const walaoPayService = require('./walaoPay.service');
const {
  PAYMENT_FAILURE,
  VIEW_CONTENT_AWE_SUCCESS,
  VIEW_CONTENT_AWE_PAID_ALREADY
}  = require('./constants')

const translateLanguage = require('src/common/handlers/translator');
const {
  CustomError
} = require('src/common/handlers');
const { getCurrencyForGateway } = require("src/common/handlers/general")
let currencyRateService;

class WalaoPayController {
  static async pay(req, res, next) {
    const {
      amount, currency,paymentCurrency
    } = req.body;
    const {
      _id, email, firstName, lastName,
    } = req.user;
    let { ip } = req;
    try {
      const tmp = ip.split(':');
      ip = tmp[0];
    } catch (error) {
      logger.warn('invalid ip ', ip);
    }
    try {
      const paymentDetails = walaoPay.paymentCurrencies[paymentCurrency];
      if (!paymentDetails) throw new Error('Incorrect Currency Chosen');
 
      const currencyRate = await currencyRateService.findOne({
        baseCurrency: walaoPay.platformCurrency,
        targetCurrency: paymentDetails.currency,
      });
      if (!currencyRate) throw new Error('Currency Rates not found');
      const conversionRate = getCurrencyForGateway(currencyRate);
      const gatewayAmount = parseFloat(amount * conversionRate).toFixed(2);

      const order = await pspOrdersService.create({
        customerId: _id,
        amount,
        language: req.headers['accept-language'] || 'en-gb',
        paymentGateway: 'WALAO',
        currency,
        dataPrimary: {
          gatewayStatus: 'initialized',
          platformCurrency:walaoPay.platformCurrency,
          sid: paymentDetails.sid,
          firstname: firstName,
          lastname: lastName,
          email,
          amount,
          gatewayAmount,
          paymentCurrency: paymentDetails.currency,
        },
      });
 
      const output = await walaoPayService.createDepositTransaction(order,
        {email, amount, paymentCurrency, gatewayAmount, paymentDetails, customerDetails:{firstName, lastName, email}}
      );
  
      const customerWallet = await walletService.findOne({ belongsTo: req.user, asset: 'USD' });
      const resTransRes = await transactionService.createPendingTransaction('DEPOSIT', {
        customerId: req.user,
        walletId: customerWallet._id,
        currency: customerWallet.asset,
        gateway: 'SKRILL',
        amount,
      });
      await pspOrdersService.updateById(order._id, {
        dataPrimary: {
          amount,
          sid:output,
        },
      });
      return ApiResponse(
        res, true, ResponseMessages.RECORD_CREATE_SUCCESS, {
          sid:output
        },
      );
    } catch (error) {
      logger.error(error.stack);
      return next(new Error('ERROR CREATING CHECKOUT ORDER'));
    }
  }

  static async postback(req, res, next) {
    try {
      const {
        amount,
        amount_raw,
        currency,
        comment,
        response,
        tid,
        txid,
        tx_action
      } = req.body;
      
      const order = await pspOrdersService.findById(tid);
      if (order) {
        const dataPrimary = {
          ...order._doc.dataPrimary,
          currency,
          amount,
          amount_raw,
          comment,
          txid,
          tx_action,
          response,
        };
        await pspOrdersService.updateById(tid, {
          gatewayStatus: response,
          dataPrimary,
        });
      }
      return ApiResponse(
        res, true, ResponseMessages.RECORD_CREATE_SUCCESS, null,
      );
    } catch (error) {
      console.log('ERROR VERIFING', error)
    }
  }

  static async successCallback(req, res, next) {
    try {
      const { tid, status } = req.query;
      let alreadyPaid = true
      const decode = await walaoPayService.decryptSuccessCallback(status)
      const order = await pspOrdersService.findById(decoded.tid);
      if (!order) {
        throw new CustomError(PAYMENT_FAILURE);
      }
      if (order.status !== 'PAID') {
        console.log('order.status not paid', order.status);
        order.gatewayStatus = 'success';
        order.dataPrimary = {
          ...order.dataPrimary,
          ...decoded,
        };
        await pspOrdersService.save();
        await pspOrdersService.markPaid(order._id);
        alreadyPaid = false
      }
      if (alreadyPaid) {
        return res.render('awe-success', {
          checkoutId: tid,
          language: order.language || 'en-US,en;q=0.9',
          ...VIEW_CONTENT_AWE_PAID_ALREADY,
          translateLanguage,
          redirectUrl: frontendDepositUrl,
        });
      }

      return res.render('awe-success', {
        checkoutId: tid,
        language: order.language || 'en-US,en;q=0.9',
        ...VIEW_CONTENT_AWE_SUCCESS,
        translateLanguage,
        redirectUrl: keys.frontendDepositUrl,
      });

    } catch (error) {
      console.log('ERROR VERIFING', error)
    }
  }
  static async failureCallback(req, res, next) {
    try {
      const { tid, status } = req.query;
      let alreadyPaid = true
      const decode = await walaoPayService.decryptSuccessCallback(status)
      const order = await pspOrdersService.findById(decoded.tid);
      if (!order) {
        throw new CustomError(PAYMENT_FAILURE);
      }
     
        console.log('order.status not paid', order.status);
        order.gatewayStatus = 'failed';
        order.dataPrimary = {
          ...order.dataPrimary,
          ...decoded,
        };
        await pspOrdersService.save();
        await pspOrdersService.markFailed(order._id);
        alreadyPaid = false
    
        return res.render('awe-cancelled', {
          redirectUrl: frontendDepositUrl,
          language: order.language || 'en-US,en;q=0.9',
          ...VIEW_CONTENT_AWE_FAILED,
          translateLanguage,
        });

    } catch (error) {
      console.log('ERROR VERIFING', error)
    }
  }
}

module.exports = WalaoPayController;

setTimeout(() => {
  const currencyRateServiceRef = require('../currencyRate/currencyRate.service');
  currencyRateService = currencyRateServiceRef;
}, 0);