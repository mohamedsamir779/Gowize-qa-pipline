const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');
const { logger } = require('src/common/lib');
const { frontendRedirectUrl } = require('src/common/data').keys;
const translateLanguage = require('src/common/handlers/translator');
const {
  VIEW_CONTENT_PAYMAXIS_PAYMENT_CANCELED,
  VIEW_CONTENT_PAYMAXIS_PAYMENT_SUCCESS,
  VIEW_CONTENT_PAYMAXIS_PAYMENT_FAILED,
} = require('./constants');
const service = require('./paymaxis.service');
class PaymaxisController {
  static async pay(req, res, next) {
    try {
      const response = await service.pay({
        ...req.body,
        language: req.headers['accept-language'] || 'en-gb',
      }, req.user);
      return ApiResponse(
        res,
        true,
        ResponseMessages.RECORD_CREATE_SUCCESS,
        response,
      );
    } catch (error) {
      logger.error(error.stack);
      return next(new Error('ERROR CREATING CHECKOUT ORDER'));
    }
  }
  static async paymentStatus(req, res, next) {
    try {
      const response = await service.paymentStatus(req.body);
      if (response) {
        return res.status(200).send();
      }
      console.log(response);
      throw new Error('ERROR UPDATING ORDER STATUS');
    } catch (error) {
      logger.error(error.stack);
      return res.status(500).send();
    }
  }
  static async renderPaymentStatus(req, res, next) {
    try {
      const order = await service.getOrder(req.query.txId);
      if (req.query && order && order.status === 'PAID') {
        return res.render('paymaxis-success', {
          redirectUrl: frontendRedirectUrl,
          language: 'en-US,en;q=0.9',
          ...VIEW_CONTENT_PAYMAXIS_PAYMENT_SUCCESS,
          description: VIEW_CONTENT_PAYMAXIS_PAYMENT_SUCCESS.description,
          translateLanguage,
          checkoutId: req.query.txId,
        });
      }
      return res.render('paymaxis-canceled', {
        redirectUrl: frontendRedirectUrl,
        language: 'en-US,en;q=0.9',
        ...VIEW_CONTENT_PAYMAXIS_PAYMENT_CANCELED,
        description: VIEW_CONTENT_PAYMAXIS_PAYMENT_CANCELED.description,
        translateLanguage,
        checkoutId: req.query.txId,
      });
    } catch (error) {
      logger.error(error.stack);
      return res.render('paymaxis-canceled', {
        redirectUrl: frontendRedirectUrl,
        language: 'en-US,en;q=0.9',
        ...VIEW_CONTENT_PAYMAXIS_PAYMENT_FAILED,
        description: error.message || VIEW_CONTENT_PAYMAXIS_PAYMENT_FAILED.description,
        translateLanguage,
        checkoutId: req.query.txId,
      });
    }
  }
}
module.exports = PaymaxisController;