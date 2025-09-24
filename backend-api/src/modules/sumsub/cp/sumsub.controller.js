/* eslint-disable class-methods-use-this */
const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');
const service = require('../sumsub.service');

class SumSubController {
  async generateAccessToken(req, res, next) {
    try {
      const rec = await service.generateAccessToken(req.params.customerId);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async webhook(req, res, next) {
    try {
      const payload = req.body;
      const rec = await service.saveEvent(payload);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new SumSubController();
