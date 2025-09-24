
/* eslint-disable class-methods-use-this */
const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');
const { logger } = require('src/common/lib');
const { jcc,frontendDepositUrl  } = require('src/common/data').keys;

const {
  pspOrdersService,
  transactionService,
  walletService,
} = require('src/modules/services');

const jccService = require('./jcc.service');
const {
  VIEW_CONTENT_JCC_SUCCESS,
  VIEW_CONTENT_JCC_FAILED
}  = require('./constants')

const translateLanguage = require('src/common/handlers/translator');
const {
  CustomError
} = require('src/common/handlers');


class JccController {
  static async generateSignature(req, res, next) {
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
        paymentGateway: 'JCC',
        currency,
      });
      const padAmt = parseFloat(amount).toFixed(2).padStart(13, "0");
      const formatedAmt = `${padAmt.substr(0,10)}${padAmt.substr(11)}`
      
      const signature = await jccService.createHashJcc(order,
        {email, formatedAmt}
      );
  
      const customerWallet = await walletService.findOne({ belongsTo: req.user, asset: 'USD' });
      const resTransRes = await transactionService.createPendingTransaction('DEPOSIT', {
        customerId: req.user,
        walletId: customerWallet._id,
        currency: customerWallet.asset,
        gateway: 'JCC',
        amount,
      });
      await pspOrdersService.updateById(order._id, {
        dataPrimary: {
          amount,
        },
      });
      return ApiResponse(
        res, true, ResponseMessages.RECORD_CREATE_SUCCESS, {
          signature, 
          formatedAmt,
          orderId:order._id.toString()
        },
      );
    } catch (error) {
      logger.error(error.stack);
      return next(new Error('ERROR CREATING CHECKOUT ORDER'));
    }
  }

  static async verify(req, res, next) {
    try {
      console.log('<============= JCC NOTIFICATION =============>',req.body);
      const payload = req.body
      const {PaddedCardNo, CExpiryMonth, CExpiryYear, ReasonCode, ResponseCode, ReasonCodeDesc, ReferenceNo} = payload
      const isValid = await jccService.verifyHashJcc(payload)
      const order = await pspOrdersService.findById(payload.OrderID);
    
        if(isValid){
          if(payload.ReasonCode === '1'){
              await pspOrdersService.updateOrder(order._id, {
                status: 'PAID' ,
                'dataPrimary.transactionId': ReferenceNo,
                'dataPrimary.cardDetails': {PaddedCardNo,expiry:`${CExpiryMonth}${CExpiryYear}`},
                'dataPrimary.reasonCode': ReasonCode,
                'dataPrimary.responseCode': ResponseCode,
                'dataPrimary.reasonCodeDesc': ReasonCodeDesc,
              })
              console.log('jcc Order Marked as Paid')
            
            return res.render('jcc-success', {
              checkoutId:ReferenceNo,
              redirectUrl: frontendDepositUrl,
              ...VIEW_CONTENT_JCC_SUCCESS,
              translateLanguage,
              language: order.language,
            });
          }
        }

        await pspOrdersService.updateOrder(order._id, {
          status: 'FAILED' ,
          'dataPrimary.transactionId': ReferenceNo,
          'dataPrimary.cardDetails': {PaddedCardNo,expiry:`${CExpiryMonth}${CExpiryYear}`},
          'dataPrimary.reasonCode': ReasonCode,
          'dataPrimary.responseCode': ResponseCode,
          'dataPrimary.reasonCodeDesc': ReasonCodeDesc,
        })
        return res.render('jcc-failed', {
          checkoutId:ReferenceNo,
          redirectUrl: frontendDepositUrl,
          ...VIEW_CONTENT_JCC_FAILED,
          translateLanguage,
          language: order.language,
        });
    } catch (error) {
      logger.error(error.stack);
      return next(new CustomError(HAYVN_CREATE_CHECKOUT_ERROR));
    }
  }

}

module.exports = JccController;
