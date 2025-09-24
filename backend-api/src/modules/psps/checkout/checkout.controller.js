const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');
const { logger } = require('src/common/lib');
const {
  CustomError,
} = require('src/common/handlers');
const CheckoutService = require('./checkout.service');

class CheckoutController {
  static async uploadProfile(req, res, next) {
    try {
      const  file  = req.file;
      console.log(req.user);
      const returnData = await CheckoutService.uploadProfile(file, req.user)
      return ApiResponse(
        res, true, ResponseMessages.RECORD_CREATE_SUCCESS, {
          ...returnData,
        },
      );
    } catch (error) {
      logger.error(`[CheckoutController ][upload profile] ${error.message}`);
      return next(new Error( error.message || 'ERROR UPLOADING CLIENT PROFILE'));
    }
  }
  static async pay(req, res, next) {
    try {
      const returnData = await CheckoutService.pay(req.body, req.user)
      return ApiResponse(
        res, true, ResponseMessages.RECORD_CREATE_SUCCESS, {
          ...returnData,
        },
      );
    } catch (error) {
      logger.error(`[CheckoutController ][deposit] ${error.message}`);
      return next(new Error( error.message || 'ERROR CREATING CHECKOUT ORDER'));
    }
  }

  static async depositCallback(req, res, next) {
    try {
      const isSuccess = await CheckoutService.callback({ ...req.body });
      return ApiResponse(
        res, true, ResponseMessages.RECORD_CREATE_SUCCESS, {
          isSuccess,
        },
      );
    } catch (error) {
      logger.error(`[CheckoutController ][deposit] ${error.message}`);
      return next(new Error('ERROR CREATING CHECKOUT ORDER'));
    }
  }
}

module.exports = CheckoutController ;
