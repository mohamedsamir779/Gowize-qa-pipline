//
const allServices = require('src/modules/services');
const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');

const { cryptoAPIService: service } = allServices;

class CryptoAPIController {
  async depositCallback(req, res, next) {
    try {
      const result = await service.depositCallback({ ...req.body });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, { result });
    } catch (error) {
      return next(error);
    }
  }

  async depositCallbackToken(req, res, next) {
    try {
      const result = await service.depositCallbackToken({ ...req.body });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, { result });
    } catch (error) {
      return next(error);
    }
  }

  async withdrawCallback(req, res, next) {
    try {
      const result = await service.withdrawCallback({
        ...req.body,
        blockchain: req.params.blockchain,
        network: req.params.network,
        fromAddress: req.params.address,
        transactionId: req.params.transactionId,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, { result });
    } catch (error) {
      return next(error);
    }
  }

  async deleteSubscription(req, res, next) {
    try {
      const result = await service.deleteSubscription({
        ...req.body,
        subscriptionId: req.params.id,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, { result });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new CryptoAPIController();
