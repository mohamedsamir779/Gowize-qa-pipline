//
const allServices = require('src/modules/services');
const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');

const { riskService: service } = allServices;

class RiskController {
  async fetchOrders(req, res, next) {
    try {
      const rec = await service.getOrders(req.query);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async fetchBalances(req, res, next) {
    try {
      const rec = await service.getBalances(req.query);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new RiskController();
