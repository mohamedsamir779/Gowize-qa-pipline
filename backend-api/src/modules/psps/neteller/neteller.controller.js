/* eslint-disable class-methods-use-this */
const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');
const { logger } = require('src/common/lib');
const { netellerPaySafe, frontendRedirectUrl } = require('src/common/data').keys;
const {
  pspOrdersService,
  transactionService,
  walletService,
} = require('src/modules/services');
const netellerService = require('./neteller.service');
const {
  VIEW_CONTENT_NETELLER_SUCCESS, VIEW_CONTENT_NETELLER_CANCELLED, VIEW_CONTENT_NETELLER_FAILED, 
  PAYMENT_HANDLE_PAYABLE, PAYMENT_HANDLE_COMPLETED, PAYMENT_HANDLE_FAILED,  PAYMENT_HANDLE_EXPIRED, PAYMENT_COMPLETED,PAYMENT_HELD, PAYMENT_FAILED

}  = require('./constants')
const translateLanguage = require('src/common/handlers/translator');
const {
  CustomError
} = require('src/common/handlers');


const netellerPaymentSuccess = async (orderId, req, res, next) => {
  const order = await pspOrdersService.findById(orderId);
  if (!order) {
    return ApiResponse(
      res, false, ResponseMessages.RECORD_UPDATE_FAIL, { message: 'invalid order id' },
    );
  }
  const { paymentHandles } = await netellerPaySafe.getOrderStatusFromPaysafe(orderId, true);
  const paysafeOrder = paymentHandles[0];

  if (paysafeOrder.gatewayResponse) {
    if (paysafeOrder.gatewayResponse.status === 'paid') {
        await pspOrdersService.markPaid(orderId);
      return ApiResponse(
        res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, {
          message: 'Successfully Updated'
        },
      );
    }
    const error = new CustomError({ message: 'Gateway response status not paid while webhook status is paid' });
    await pspOrdersService.markFailed(orderId, error, error.message);
    return ApiResponse(
      res, false, ResponseMessages.RECORD_UPDATE_FAIL, {
        message: error.message
      },
    );
  }
  const error = new CustomError({ message: 'Gateway response not found in order status' });
  await netellerPaySafe.markFailed(orderId, error, error.message);
  return ApiResponse(
    res, false, ResponseMessages.RECORD_UPDATE_FAIL, {
      message: error.message
    },
  );
};

const netellerPaymentFailed = async (orderId, req, res, next) => {
  const order = await pspOrdersService.findById(orderId);
  if (!order) {
    return ApiResponse(
      res, false, ResponseMessages.RECORD_UPDATE_FAIL, { message: 'invalid order id' },
    );
  }
  const { paymentHandles } = await netellerPaySafe.getOrderStatusFromPaysafe(orderId, true);
  const paysafeOrder = paymentHandles[0];
  if (paysafeOrder.gatewayResponse) {
    if (
      paysafeOrder.gatewayResponse.status === 'failed'
      || paysafeOrder.gatewayResponse.status === 'error'
      || paysafeOrder.gatewayResponse.status === 'declined') {
      await pspOrdersService.markFailed(orderId);
        return ApiResponse(
        res, true, ResponseMessages.RECORD_UPDATE_FAIL, {
          message: 'Transaction Failed'
        },
      );
    }
  } else {
    const error = new CustomError({ message: 'Gateway response not found in order status' });
    await pspOrdersService.markFailed(orderId, error, error.message);
    return ApiResponse(
      res, false, ResponseMessages.RECORD_UPDATE_FAIL, {
        message: error.message
      },
    );
  }
};

const netellerPaymentCanceled = async (orderId, req, res, next) => {
  const order = await pspOrdersService.findById(orderId);
  if (!order) {
    return ApiResponse(
      res, false, ResponseMessages.RECORD_UPDATE_FAIL, { message: 'invalid order id' },
    );
  }
  const { paymentHandles } = await netellerService.getOrderStatusFromPaysafe(orderId, true);
  const paysafeOrder = paymentHandles[0];

  if (paysafeOrder.gatewayResponse) {
    if (
      paysafeOrder.gatewayResponse.status === 'cancelled'
      || paysafeOrder.gatewayResponse.status === 'expired') {
      await netellerPaySafe.markCancelled(orderId);
      return ApiResponse(
        res, true, ResponseMessages.RECORD_UPDATE_FAIL, {
          message: 'Transaction Failed'
        },
      );
    }
  } else {
    const error = new CustomError({ message: 'Gateway response not found in order status' });
    await pspOrdersService.markCancelled(orderId, error, error.message);
    console.log('Paysafe:Neteller: Gateway response not found in order status');
    return ApiResponse(
      res, false, ResponseMessages.RECORD_UPDATE_FAIL, {
        message: error.message
      },
    );
  }
};

const netellerPaymentPayable = async (req, res, next, body) => {
  const { merchantRefNum, payload = {} } = body;
  if (payload.status === 'PAYABLE') {
    const paymentObj = await netellerService.makePayment(payload);
    console.log('Paysafe---------------------------', JSON.stringify(paymentObj));
  }

  return ApiResponse(
    res, true, ResponseMessages.RECORD_CREATE_SUCCESS, {
      message: 'Payment done!'
    },
  );
};

class NetellerController {
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
    // ip = '5.32.117.250';`
    try {
      const order = await pspOrdersService.create({
        customerId: _id,
        amount,
        language: req.headers['accept-language'] || 'en-gb',
        paymentGateway: 'NETELLER',
        currency,
      });
 
      const output = await netellerService.createPaymentHandle(order,
        {email, amount}
      );
      const { links, error, gatewayResponse, id } = output;

      const customerWallet = await walletService.findOne({ belongsTo: req.user, asset: 'USD' });
      const resTransRes = await transactionService.createPendingTransaction('DEPOSIT', {
        customerId: req.user,
        walletId: customerWallet._id,
        currency: customerWallet.asset,
        gateway: 'NETELLER',
        amount,
      });
      await pspOrdersService.updateById(order._id, {
        checkoutId:id,
        dataPrimary: {
          amount,
          result:gatewayResponse,
        },
      });
      return ApiResponse(
        res, true, ResponseMessages.RECORD_CREATE_SUCCESS, {
          id, orderId: order._id, redirect_url: links[0].href
        },
      );
    } catch (error) {
      logger.error(error.stack);
      return next(new Error('ERROR CREATING CHECKOUT ORDER'));
    }
  }

  static async success(req, res, next) {
    try {
      const { orderId } = req.query;
      const order = await pspOrdersService.findById(orderId);
      if (!order) {
        return next(new Error('invalid order id'));
      }

      return res.render('neteller-success', {
        redirectUrl: frontendRedirectUrl,
        language: order.language,
        ...VIEW_CONTENT_NETELLER_SUCCESS,
        translateLanguage,
      });
    } catch (err) {
      console.log('========================== error ', err);
      return next(new Error("ERROR WHILE IN SUCESS"));
    }
  }

  static async getResponse(req, res, next) {

    return ApiResponse(
      res, true, ResponseMessages.RECORD_CREATE_SUCCESS, null,
    );
  }

  static async response(req, res, next) {
    try {
      const { payload, eventType } = req.body;
      if (req.body && payload.merchantRefNum) {
        const {
          accountId, id, merchantRefNum, amount, status, paymentType,
        } = payload;
        switch (eventType) {
          case PAYMENT_HANDLE_PAYABLE:
            return netellerPaymentPayable(req, res, next, req.body);
          case PAYMENT_HANDLE_FAILED:
            return netellerPaymentCanceled(merchantRefNum, req, res, next);
          case PAYMENT_COMPLETED:
            return netellerPaymentSuccess(merchantRefNum, req, res, next);
          case PAYMENT_FAILED:
            return netellerPaymentFailed(merchantRefNum, req, res, next);
          default:
            return netellerPaymentFailed(merchantRefNum, req, res, next);
        }
      } else {
         
      return ApiResponse(
        res, true, ResponseMessages.RECORD_FETCH_NOT_FOUND, null,
      );
        
      }
    } catch (err) {
      console.log('----------------------Erro occured in webhook => ',err);
      return next(new CustomError(VIEW_CONTENT_NETELLER_FAILED));
    }
  }

  static async cancel(req, res, next) {
    try { 
      console.log('---------------------------------', req.query, req.body);
      const { orderId } = req.query;
      const order = await pspOrdersService.findById(orderId);
      if (!order) {
        return next(new CustomError({ message: 'invalid order id' }));
      }

      const { paymentHandles } = await netellerService.getOrderStatusFromPaysafe(orderId, true);
      const paysafeOrder = paymentHandles[0];

      const orderObj = await pspOrdersService.findById(orderId);
      if (paysafeOrder.status === 'expired' || paysafeOrder.status === 'pending' || paysafeOrder.status === 'cancelled' || paysafeOrder.status === 'INITIATED') {
        await pspOrdersService.markCancelled(orderId);
      }
      return res.render('neteller-cancelled', {
        redirectUrl: netellerPaySafe.frontendDepositUrl,
        ...VIEW_CONTENT_NETELLER_CANCELLED,
        translateLanguage,
        language: orderObj.language,
      });
    } catch (error) {
      logger.error(error.stack);
      return next(error);
    }
  }

  static async fail(req, res, next) {
    try {
      const { orderId } = req.query;
      const order = await pspOrdersService.findById(orderId);
      if (!order) {
        return next(new CustomError({ message: 'invalid order id' }));
      }
      return res.render('neteller-cancelled', {
        redirectUrl: frontendDepositUrl,
        ...VIEW_CONTENT_NETELLER_FAILED,
        translateLanguage,
        language: order.language,
      });
    } catch (error) {
      logger.error(error.stack);
      return next(new CustomError(VIEW_CONTENT_NETELLER_FAILED));
    }
  }
}

module.exports = NetellerController;
