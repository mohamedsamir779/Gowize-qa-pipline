const allServices = require('src/modules/services');
const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');

const { subscriptionsService: service } = allServices;

class SubscriptionsController {
  async subscribePushNotification(req, res, next) {
    try {
      const rec = await service.subscribeCRMPushNotification(req.body, {
        ...req.user,
        token: req.token,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async unsubscribePushNotification(req, res, next) {
    try {
      const rec = await service.unsubscribeCRMPushNotification(req.body, {
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
