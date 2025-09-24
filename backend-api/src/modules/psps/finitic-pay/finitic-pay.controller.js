/* eslint-disable class-methods-use-this */
const { ResponseMessages, keys } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');
const { logger } = require('src/common/lib');
// const translateLanguage = require('src/common/handlers/translator');

const service = require('./finitic-pay.service');

class FiniticPayController {
  static async getCheckoutURL(req, res, next) {
    let { ip } = req;
    try {
      const tmp = ip.split(':');
      ip = tmp?.[0];
    } catch (error) {
      logger.warn('invalid ip ', ip);
    }
    try {
      const response = await service.pay(
        {
          ...req.body,
          language: req.headers['accept-language'] || 'en-gb',
        },
        {
          ip: req.ip,
          ...req.user,
        },
      );
      return ApiResponse(
        res, true, ResponseMessages.RECORD_CREATE_SUCCESS, {
          url: response.url,
        },
      );
    } catch (error) {
      logger.error(error.stack);
      return next(new Error('ERROR CREATING CHECKOUT ORDER'));
    }
  }
  static async startCheckout(req, res, next) {
    const { finiticPay } = keys;
    console.log('startCheckout', {body:req.body ,params:req.params });
    // cp/psp/finitic-pay/checkout
    const {order , callbackUrl} =await service.createPspOrder(req.body)
    console.log("finiticPay", {finiticPay});
    const response =  `${finiticPay.depositUrl}/cp/psp/finitic-pay/checkout?merchant=${finiticPay.merchantId}&amount=${req.body.amount}&currency=${req.body.currency}&callbackUrl=${callbackUrl}&orderId=${order._id}`;
    return ApiResponse(
      res, true, {status:200 , message:"checkout link created Successfully"}, {
        url: response,
      },
    );
  }
  static async verify(req, res, next) {
    try {
      const { orderId } = req.params;
      const response = await service.paymentStatus(orderId, req.body);
      if (response) {
        return res.status(200).send();
      }
      console.log(response);
      throw new Error('ERROR UPDATING ORDER STATUS');
    } catch (error) {
      console.log(error);
      logger.error(error.stack);
      return res.status(500).send();
    }
  }

  static async getFees(req, res, next) {
    try {
      const response = await service.getFees(req.query);
      return ApiResponse(
        res, true, ResponseMessages.RECORD_CREATE_SUCCESS, response,
      );
    } catch (error) {
      logger.error(error.stack);
      return next(new Error('ERROR CREATING CHECKOUT ORDER'));
    }
  }
}

module.exports = FiniticPayController;
