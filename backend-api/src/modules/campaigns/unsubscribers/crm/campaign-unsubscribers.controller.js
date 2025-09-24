const { ResponseMessages } = require('../../../../common/data');
const { ApiResponse } = require('../../../../common/handlers');
const service = require('./campaign-unsubscribers.service');

class CampaignUnsubscribersController {
  async getUnsubscribers(req, res, next) {
    const { page, limit } = req.query;
    try {
      const unsubscribers = await service.findWithPagination({
        page,
        limit,
      }, {
        populate: [{
          path: 'customerId',
          select: 'firstName lastName email',
        }],
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, unsubscribers);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new CampaignUnsubscribersController();
