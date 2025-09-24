
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

const jccService = require('./fasapay.service');
const {
  VIEW_CONTENT_JCC_SUCCESS,
  VIEW_CONTENT_JCC_FAILED
}  = require('./constants')

const translateLanguage = require('src/common/handlers/translator');
const {
  CustomError
} = require('src/common/handlers');


class FasapayController {
  static async statusUpdate(req, res, next) {
    const {
      customer_Id,
      fp_amnt,
      fp_fee_amnt,
      fp_fee_mode,
      fp_total,
      fp_batchnumber,
      fp_store,
      fp_timestamp,
      fp_unix_time,
      fp_currency,
      fp_paidto
    } = req.body;

    let { ip } = req;
    try {
      const tmp = ip.split(':');
      ip = tmp[0];
    } catch (error) {
      logger.warn('invalid ip ', ip);
    }
    try {
      const order = await pspOrdersService.create({
        status:"PAID",
        customerId: customer_Id,
        amount:fp_amnt,
        language: req.headers['accept-language'] || 'en-gb',
        paymentGateway: 'FASAPAY',
        currency:fp_currency,
        dataPrimary: {
          amount:fp_amnt,
          feesAmount:fp_fee_amnt,
          depositAmount:fp_total,
          feeMode:fp_fee_mode,
          fasaPayAccount:fp_paidto,
          transactionId:fp_batchnumber
        },
      });
  
      const customerWallet = await walletService.findOne({ belongsTo: customer_Id, asset: 'USD' });
      const resTransRes = await transactionService.createPendingTransaction('DEPOSIT', {
        status:"APPROVED",
        customerId: customer_Id,
        walletId: customerWallet._id,
        currency: customerWallet.asset,
        gateway: 'FASAPAY',
        amount,
      });
   
      return res.send({status:"ok"})
    } catch (error) {
      logger.error(error.stack);
      return next(new Error('ERROR CREATING CHECKOUT ORDER'));
    }
  }

}

module.exports = FasapayController;
