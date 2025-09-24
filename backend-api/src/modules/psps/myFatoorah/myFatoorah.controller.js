
/* eslint-disable class-methods-use-this */
const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');
const { logger } = require('src/common/lib');
const { frontendDepositUrl  } = require('src/common/data').keys;

const {
  pspOrdersService,
  transactionService,
  walletService,
} = require('src/modules/services');

const myFatoorahService = require('./myFatoorah.service');
const {
  MY_FATOORAH_SUCCESS,
  MY_FATOORAH_FAILURE,
  MY_FATOORAH_EXCEPTION_ERROR,
  VIEW_CONTENT_MYFATOORAH_SUCCESS,
  VIEW_CONTENT_MYFATOORAH_CANCELLED,
  VIEW_CONTENT_MYFATOORAH_FAILED
}  = require('./constants')

const translateLanguage = require('src/common/handlers/translator');
const {
  CustomError
} = require('src/common/handlers');


class MyFatoorhaController {

  static async getPaymentMethods(req, res, next) {
    try {
      const paymentMehods = await myFatoorahService.initiatePayment();
      if (paymentMehods.PaymentMethods) {
        return ApiResponse(
          res, true, ResponseMessages.RECORD_CREATE_SUCCESS, {
            paymentMethods: paymentMehods.PaymentMethods
          },
        );
      }
      return next(new CustomError({ ...MY_FATOORAH_FAILURE }));
    } catch (error) {
      logger.error(error.stack);
      return next(new CustomError({ ...MY_FATOORAH_FAILURE }));
    }
  }

  static async pay(req, res, next) {
    const {
      amount, currency, paymentMethod, paymentMethodId
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
    // ip = '5.32.117.250';`
    try {
      const order = await pspOrdersService.create({
        customerId: _id,
        amount,
        language: req.headers['accept-language'] || 'en-gb',
        paymentGateway: 'MYFATOORAH',
        currency,

      });
 
      const output = await myFatoorahService.executePayment(order,
        {email, amount, paymentMethodId}
      );

      const customerWallet = await walletService.findOne({ belongsTo: req.user, asset: 'USD' });
      const resTransRes = await transactionService.createPendingTransaction('DEPOSIT', {
        customerId: req.user,
        walletId: customerWallet._id,
        currency: customerWallet.asset,
        gateway: 'MYFATOORAH',
        amount,
      });

      await pspOrdersService.updateById(order._id, {
        checkoutId: output.InvoiceId,
        dataPrimary: {
          paymentMethodId,
          paymentMethod,
          paymentUrl: output.PaymentURL,
        },
      });
      return ApiResponse(
        res, true, ResponseMessages.RECORD_CREATE_SUCCESS, {
          PaymentURL:output.PaymentURL
        },
      );
    } catch (error) {
      logger.error(error.stack);
      return next(new Error('ERROR CREATING CHECKOUT ORDER'));
    }
  }

  static async success(req, res, next) {
    try {
      const { paymentId } = req.query;
      const orderDetails = await myFatoorahService.getPaymentStatus(paymentId);
      const order = await pspOrdersService.findOne({ checkoutId: orderDetails.InvoiceId});
      if (!order) {
        return next(new Error('invalid order id'));
      }

      if (orderDetails.InvoiceStatus === 'Paid') {
        await pspOrdersService.markPaid(order._id);

        return res.render('myfatoorah-success', {
          redirectUrl: frontendDepositUrl,
          language: order.language,
          ...VIEW_CONTENT_MYFATOORAH_SUCCESS,
          translateLanguage,
        });
      }

      return res.render('myfatoorah-failed', {
        redirectUrl: frontendDepositUrl,
        language: order.language,
        ...VIEW_CONTENT_MYFATOORAH_FAILED,
        translateLanguage,
      });
    } catch (err) {
      console.log('========================== error ', err);
      return next(new Error("ERROR WHILE IN SUCESS"));
    }
  }

  static async failed(req, res, next) {
    try {
      const { paymentId } = req.query;
      const orderDetails = await myFatoorahService.getPaymentStatus(paymentId);
      const order = await pspOrdersService.findOne({ checkoutId: orderDetails.InvoiceId});
      if (!order) {
        return next(new Error('invalid order id'));
      }

      if (orderDetails.InvoiceStatus === 'Pending') {
        if (order) {
          const errorTransaction = orderDetails.InvoiceTransactions.find((x) => x.TransactionStatus === 'Failed');
          if (errorTransaction) {
            await pspOrdersService.markFailed(order._id);
            return res.render('myfatoorah-failed', {
              redirectUrl: frontendDepositUrl,
              ...VIEW_CONTENT_MYFATOORAH_FAILED,
              translateLanguage,
              language: 'en',
            });
          }
          await pspOrdersService.markCancelled(order._id);
          return res.render('myfatoorah-cancelled', {
            redirectUrl: frontendDepositUrl,
            ...VIEW_CONTENT_MYFATOORAH_CANCELLED,
            translateLanguage,
            language: 'en',
          });
        }
        return res.render('myfatoorah-failed', {
          redirectUrl: frontendDepositUrl,
          ...VIEW_CONTENT_MYFATOORAH_FAILED,
          translateLanguage,
          language: 'en',
        });
      }

      return res.render('myfatoorah-failed', {
        redirectUrl: frontendDepositUrl,
        language: order.language,
        ...VIEW_CONTENT_MYFATOORAH_FAILED,
        translateLanguage,
      });
    } catch (err) {
      console.log('========================== error ', err);
      return next(new Error("ERROR WHILE IN SUCESS"));
    }
  }
 

}

module.exports = MyFatoorhaController;
