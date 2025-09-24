/* eslint-disable class-methods-use-this */
const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');
const { logger } = require('src/common/lib');
const { frontendRedirectUrl } = require('src/common/data').keys;
const translateLanguage = require('src/common/handlers/translator');
const {
  VIEW_CONTENT_OLD_FOREX_PAYMENT_CANCELED,
  VIEW_CONTENT_OLD_FOREX_PAYMENT_SUCCESS,
  VIEW_CONTENT_OLD_FOREX_PAYMENT_FAILED,
} = require('./constants');
const service = require('./olxforex.service');

class OlxforexController {
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
      const response = await service.paymentStatus(req.query);
      if (response && response.status === 'SUCCESS') {
        return res.render('olxforex-success', {
          redirectUrl: frontendRedirectUrl,
          language: 'en-US,en;q=0.9',
          ...VIEW_CONTENT_OLD_FOREX_PAYMENT_SUCCESS,
          description: response.description || VIEW_CONTENT_OLD_FOREX_PAYMENT_SUCCESS.description,
          translateLanguage,
          checkoutId: response.orderId,
        });
      }
      return res.render('olxforex-canceled', {
        redirectUrl: frontendRedirectUrl,
        language: 'en-US,en;q=0.9',
        ...VIEW_CONTENT_OLD_FOREX_PAYMENT_CANCELED,
        description: response.description || VIEW_CONTENT_OLD_FOREX_PAYMENT_CANCELED.description,
        translateLanguage,
        checkoutId: response.orderId,
      });
    } catch (error) {
      logger.error(error.stack);
      return res.render('olxforex-canceled', {
        redirectUrl: frontendRedirectUrl,
        language: 'en-US,en;q=0.9',
        ...VIEW_CONTENT_OLD_FOREX_PAYMENT_FAILED,
        description: error.message || VIEW_CONTENT_OLD_FOREX_PAYMENT_FAILED.description,
        translateLanguage,
        checkoutId: req.query.number,
      });
    }
  }
}

module.exports = OlxforexController;
