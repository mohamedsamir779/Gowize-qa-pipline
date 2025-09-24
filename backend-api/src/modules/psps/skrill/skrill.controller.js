/* eslint-disable class-methods-use-this */
const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');
const { logger } = require('src/common/lib');
const { skrill, frontendRedirectUrl } = require('src/common/data').keys;

const {
  pspOrdersService,
  transactionService,
  walletService,
} = require('src/modules/services');

const skrillService = require('./skrill.service');
const {
  VIEW_CONTENT_NETELLER_SUCCESS, VIEW_CONTENT_NETELLER_CANCELLED, VIEW_CONTENT_NETELLER_FAILED, 
  PAYMENT_HANDLE_PAYABLE, PAYMENT_HANDLE_COMPLETED, PAYMENT_HANDLE_FAILED,  PAYMENT_HANDLE_EXPIRED, PAYMENT_COMPLETED,PAYMENT_HELD, PAYMENT_FAILED

}  = require('./constants')

const translateLanguage = require('src/common/handlers/translator');
const {
  CustomError
} = require('src/common/handlers');


class SkrillController {
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
        paymentGateway: 'SKRILL',
        currency,
      });
 
      const output = await skrillService.createPaymentHandle(order,
        {email, amount}
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

  static async verify(req, res, next) {
    try {

      console.log('<============= SKRILL NOTIFICATION =============>');
      console.log('[req.body data from SKRILL] =>', req.body)
      const skrillTransaction = req.body;
      const { status,transaction_id, amount,failed_reason_code,mb_transaction_id, pay_from_email,payment_type,customer_id } = skrillTransaction;

      const order = await pspOrdersService.findById(transaction_id);
      console.log("--------skrill----------order---", order)
      
      if (Number(status) === 2) { //approved
             
        await pspOrdersService.updateOrder(order._id, {
          status: 'PAID' ,
          'dataPrimary.transactionId': mb_transaction_id,
          'dataPrimary.payment_type': payment_type,
          'dataPrimary.pay_from_email': pay_from_email,
          'dataPrimary.skrill_customer_id': customer_id
        })
        console.log('skrill Order Marked as Paid')

      }else { //failed,pending and cancelled
        console.log("------------Skril FAILED or REjected")
     
        if(Number(status) === -2 || Number(status) === -1){
          await pspOrdersService.updateOrder(order._id, {
            status: 'UNPAID',
            'dataPrimary.failed_reason': failed_reason_code ? failed_reason_code : 'N/A'
          })
          console.log('skrill Order marked as unPaid');
        }
      }
     
      console.log("--skrill-------verify---END")
      res.send({
        "status": 0,
        "description": "Ok",
        "version": "1.3"
      })
    } catch (error) {
      console.log('skrill------- ERROR VERIFING', error)
    }
  }
}

module.exports = SkrillController;
