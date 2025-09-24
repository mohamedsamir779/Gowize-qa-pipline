const allServices = require('src/modules/services');
const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');

const { notificationsService: service } = allServices;

class NotificationsController {
  async fetchNotifications(req, res, next) {
    try {
      const rec = await service.fetchNotifications(req.user._id, 'users', req.query);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async markNotificationsRead(req, res, next) {
    try {
      const rec = await service.markNotificationsRead(req.user._id, 'users', req.body);
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new NotificationsController();
