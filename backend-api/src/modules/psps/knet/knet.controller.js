
/* eslint-disable class-methods-use-this */
const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');
const { logger } = require('src/common/lib');
const { frontendDepositUrl, knet  } = require('src/common/data').keys;

const {
  pspOrdersService,
  transactionService,
  walletService,
} = require('src/modules/services');

const knetService = require('./knet.service');
const {
  KNET_AUTH_CHECKOUT_ERROR,
  KNET_AUTH_CHECKOUT_SUCCESS,
  VIEW_CONTENT_KNET_SUCCESS,
  VIEW_CONTENT_KNET_CANCELLED,
  VIEW_CONTENT_KNET_FAILED,
  VIEW_CONTENT_QR_FAILED
}  = require('./constants')

const translateLanguage = require('src/common/handlers/translator');
const {
  CustomError
} = require('src/common/handlers');

let currencyRateService;

const getCurrencyForGateway = (currencyRate, requiredGateway) => (currencyRate.gateways
  ? currencyRate.gateways[requiredGateway]
    ? currencyRate.gateways[requiredGateway]
    : currencyRate.value
  : currencyRate.value
);

class KnetController {

  
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

      const currencyRate = await currencyRateService.findOne({ baseCurrency: currency, targetCurrency: 'KWD' });

      if (!currencyRate) {
        console.log('Error, Currency Rates not found');
        return next(new CustomError(KNET_AUTH_CHECKOUT_ERROR));
      }
      const gatewayValue = getCurrencyForGateway(currencyRate, 'KNET')
      const order = await pspOrdersService.create({
        customerId: _id,
        amount,
        language: req.headers['accept-language'] || 'en-gb',
        paymentGateway: 'KNET',
        currency,
      });
 
      const {
        checkoutId, orderId, order: knetOrderDetails, result,
      }= await knetService.createCheckoutItem(order,
        {gatewayValue, email, amount, paymentMethodId}
      );
      
      if (!checkoutId) {
        return next(new CustomError(KNET_AUTH_CHECKOUT_ERROR));
      }
 

      const customerWallet = await walletService.findOne({ belongsTo: req.user, asset: 'USD' });
      const resTransRes = await transactionService.createPendingTransaction('DEPOSIT', {
        customerId: req.user,
        walletId: customerWallet._id,
        currency: customerWallet.asset,
        gateway: 'KNET',
        amount,
      });

      await pspOrdersService.updateById(order._id, {
        dataPrimary: {
          checkoutId,
          amount,
          result,
        },
      });
      return ApiResponse(
        res, true, ResponseMessages.RECORD_CREATE_SUCCESS,
          { checkoutId, order: knetOrderDetails, orderId: order._id }
      );
    } catch (error) {
      logger.error(error.stack);
      return next(new Error('ERROR CREATING CHECKOUT ORDER'));
    }
  }

  static async verify(req, res, next) {
    try {
      const { orderId } = req.params;
      const { encrp, ErrorCode } = req.query;

      const order = await pspOrdersService.findById(orderId);
      if (!order) {
        return next(new Error('invalid order id'));
      }

      if (ErrorCode) {
        await pspOrdersService.markFailed(order.id);
        await pspOrdersService.updateById(order._id, {
          dataPrimary: {
            ...order.dataPrimary,
            errorCode: ErrorCode,
            errorMessage: knetService.getErrorDetails(ErrorCode),
          },
        });
        return res.render('knet-cancelled', {
          redirectUrl: knet.frontendDepositUrl,
          language: order.language,
          ...VIEW_CONTENT_KNET_FAILED,
          translateLanguage,
        });
      }

      const { result, accessToken = '' } = await knetService.verifyPayment(order._id, order.checkoutId);

      if (order.status !== 'PAID' && order.status !== 'CANCELLED' && order.status !== 'FAILED') {
        if (result && result.Status === '1' && result.Message === 'Success') {
          await pspOrdersService.markPaid(order.id);
          await pspOrdersService.updateById(order._id, {
            dataPrimary: {
              ...order.dataPrimary,
              payType: result.PayType,
              referenceId: result.referenceId,
              transactionId: result.transactionId,
              receiptNo: result.ReceiptNo,
              paymentId: result.PaymentId,
              trackId: result.TrackId,
              message: result.Message,
              status: result.Status,
              postData: result.PostDate,
              checkoutId2: accessToken,
            },
            checkoutId2: accessToken,
          });
          console.log('order currency', order);
        
          const viewData = result.PayType === knet.payTypeKnet
            ? VIEW_CONTENT_KNET_SUCCESS
            : VIEW_CONTENT_QR_SUCCESS;
          return res.render('knet-success', {
            redirectUrl: knet.frontendDepositUrl,
            language: order.language,
            ...viewData,
            translateLanguage,
          });
        }
        if (result && result.Status) {
          await pspOrdersService.markFailed(order.id);
          await pspOrdersService.updateById(order._id, {
            dataPrimary: {
              ...order.dataPrimary,
              payType: result.PayType,
              referenceId: result.referenceId,
              transactionId: result.transactionId,
              receiptNo: result.ReceiptNo,
              paymentId: result.PaymentId,
              trackId: result.TrackId,
              status: result.Status,
              message: result.Message,
              postData: result.PostDate,
            },
          });
          const viewData = result.PayType === keys.payTypeKnet
            ? VIEW_CONTENT_KNET_FAILED
            : VIEW_CONTENT_QR_FAILED;
          return res.render('knet-cancelled', {
            redirectUrl: keys.frontendDepositUrl,
            language: order.language,
            ...viewData,
            translateLanguage,
          });
        }
      } else {
        console.log('Already Paid => ', order._id);
        const viewData = result.PayType === keys.payTypeKnet
          ? VIEW_CONTENT_KNET_FAILED
          : VIEW_CONTENT_QR_FAILED;
        return res.render('knet-cancelled', {
          redirectUrl: keys.frontendDepositUrl,
          language: order.language,
          ...viewData,
          translateLanguage,
        });
      }

    } catch (err) {
      console.log('========================== error ', err);
      return next(new Error("ERROR WHILE IN SUCESS"));
    }
  }

}

module.exports = KnetController;

setTimeout(() => {
  const currencyRateServiceRef = require('../currencyRate/currencyRate.service');
  currencyRateService = currencyRateServiceRef;
}, 0);