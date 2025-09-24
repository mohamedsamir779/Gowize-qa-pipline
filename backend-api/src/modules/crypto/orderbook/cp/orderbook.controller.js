//
const allServices = require('src/modules/services');
const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');

const { orderBookService: service } = allServices;

class OrderBookController {
  async getPaginate(req, res, next) {
    try {
      const markupId = (req.user && req.user.markupId) || '';
      const rec = await service.findWithPagination({
        ...req.query,
      });
      const docs = await service.getMultipleMarkupPricing(rec.docs, markupId);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, {
        ...rec,
        docs,
      });
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

module.exports = new OrderBookController();
