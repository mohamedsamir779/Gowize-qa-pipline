const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');
const { logger } = require('src/common/lib');
const {
  CustomError,
} = require('src/common/handlers');
const EpaymeService = require('./epayme.service');

class EpaymeController {
  static async pay(req, res, next) {
    try {
      const returnData = await EpaymeService.pay({
        ...req.body,
        language: req.headers['accept-language'] || 'en-gb',
      }, req.customer);
      return ApiResponse(
        res, true, ResponseMessages.RECORD_CREATE_SUCCESS, {
          ...returnData,
        },
      );
    } catch (error) {
      logger.error(`[EpaymeController][deposit] ${error.message}`);
      return next(new Error('ERROR CREATING CHECKOUT ORDER'));
    }
  }

  static async depositCallback(req, res, next) {
    try {
      const isSuccess = await EpaymeService.callback({ ...req.body });
      return ApiResponse(
        res, true, ResponseMessages.RECORD_CREATE_SUCCESS, {
          isSuccess,
        },
      );
    } catch (error) {
      logger.error(`[EpaymeController][deposit] ${error.message}`);
      return next(new Error('ERROR CREATING CHECKOUT ORDER'));
    }
  }
}

module.exports = EpaymeController;
