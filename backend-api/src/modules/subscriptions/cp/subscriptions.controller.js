const allServices = require('src/modules/services');
const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');

const { subscriptionsService: service } = allServices;

class SubscriptionsController {
  async subscribeCPPushNotification(req, res, next) {
    try {
      const rec = await service.subscribeCPPushNotification(req.body, {
        ...req.user,
        token: req.token,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async unsubscribeCPPushNotification(req, res, next) {
    try {
      const rec = await service.unsubscribeCPPushNotification(req.body, {
        ...req.user,
        token: req.token,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new SubscriptionsController();
