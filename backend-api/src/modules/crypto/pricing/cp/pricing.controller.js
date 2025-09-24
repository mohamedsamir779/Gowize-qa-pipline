//
const allServices = require('src/modules/services');
const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');

const { pricingService: service } = allServices;

class PricingController {
  async getPaginate(req, res, next) {
    try {
      const {
        markupId,
        ...rest
      } = req.query;
      const rec = await service.findWithPagination({
        ...rest,
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
}

module.exports = new PricingController();
