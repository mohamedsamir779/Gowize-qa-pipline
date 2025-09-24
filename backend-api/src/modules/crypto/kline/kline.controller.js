//
const allServices = require('src/modules/services');
const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');

const { klineService: service } = allServices;

class KlineController {
  async getKlineData(req, res, next) {
    try {
      const markupId = (req.user && req.user.markupId) || '';
      const result = await service.fetchOHLCVFromDB({ ...req.query, markupId });
      const { symbol } = req.query;
      const data = await service.getMultipleMarkupKline(result, markupId);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, { symbol, data });
    } catch (error) {
      return next(error);
    }
  }

  async getAllMarketsKline(req, res, next) {
    try {
      const markupId = (req.user && req.user.markupId) || '';
      const result = await service.fetchChartDataForAllMarkets({ ...req.query, markupId });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, result);
    } catch (error) {
      return next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const { markupId } = req.query;
      const rec = await service.find({});
      const docs = await service.getMultipleMarkupPricing(rec, markupId);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, docs);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new KlineController();
