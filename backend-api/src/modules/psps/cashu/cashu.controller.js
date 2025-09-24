/* eslint-disable class-methods-use-this */
const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');
const { logger } = require('src/common/lib');
const { cashu,frontendDepositUrl  } = require('src/common/data').keys;

const {
  pspOrdersService,
  transactionService,
  walletService,
} = require('src/modules/services');

const cashuService = require('./cashu.service');
const {
  CASHU_CODE_SUCCESS,
  CASHU_CODE_ERROR,
  VIEW_CONTENT_CASHU_FAILED,
  VIEW_CONTENT_CASHU_SUCCESS,
  UNPAID
}  = require('./constants')

const translateLanguage = require('src/common/handlers/translator');
const {
  CustomError
} = require('src/common/handlers');


class CashuController {
  static async pay(req, res, next) {
    const {
      amount, currency,
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
      const order = await pspOrdersService.create({
        customerId: _id,
        amount,
        language: req.headers['accept-language'] || 'en-gb',
        paymentGateway: 'CASHU',
        currency,
      });
 
      const output = await cashuService.createPaymentHandle(order,
        {email, amount}
      );
  
      const customerWallet = await walletService.findOne({ belongsTo: req.user, asset: 'USD' });
      const resTransRes = await transactionService.createPendingTransaction('DEPOSIT', {
        customerId: req.user,
        walletId: customerWallet._id,
        currency: customerWallet.asset,
        gateway: 'CASHU',
        amount,
      });

    
      await pspOrdersService.updateById(order._id, {
        dataPrimary: {
          amount,
          result:output,
        },
      });
      return ApiResponse(
        res, true, ResponseMessages.RECORD_CREATE_SUCCESS, {
          checkoutId:output.checkoutId
        },
      );
    } catch (error) {
      logger.error(error.stack);
      return next(new Error('ERROR CREATING CHECKOUT ORDER'));
    }
  }

  static async successCallback(req, res, next) {
    try {
      logger.info(`control in cashu success callback${JSON.stringify(req.body)}`);
      const {
        trn_id, verificationString, txt1, txt2, token,
      } = req.body;
      const order = await pspOrdersService.findOne({
        'dataPrimary.result.soapBody.txt1': txt1,
      });

      const isSucess = await cashuService.successCallback(order,{
        trn_id, verificationString, txt1, txt2, token,
      });

      if(isSucess){
        await pspOrdersService.markPaid(order._id);
      }
      return res.render('cashu-success', {
        checkoutId: txt1,
        redirectUrl: frontendDepositUrl,
        language: order.language,
        ...VIEW_CONTENT_CASHU_SUCCESS,
        translateLanguage,
      });
    } catch (error) {
      logger.error(error.stack);
      return next(new CustomError(CASHU_CODE_ERROR));
    }
  }

  static async failureCallback(req, res, next) {
    try {
      logger.info(`control in cashu failure callback${JSON.stringify(req.body)}`);
      const { txt1 } = req.body;
      const order = await orderService.findOne({
        'dataPrimary.result.soapBody.txt1': txt1,
      });
      const isSucess = await cashuService.failedCallback(order, { txt1 });
      if(isSucess){
        if(order.status === UNPAID){
          await pspOrdersService.markFailed(order._id);
        }
      }
      return res.render('cashu-cancelled', {
        redirectUrl: frontendDepositUrl,
        language: order.language,
        ...VIEW_CONTENT_CASHU_FAILED,
        translateLanguage,
      });
    } catch (error) {
      logger.error(error.stack);
      return next(new CustomError(CASHU_CODE_ERROR));
    }
  }

}

module.exports = CashuController;
