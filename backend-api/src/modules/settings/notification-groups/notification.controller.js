//
const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');
const notificationGroups = require('../settings.service');

class NotificationController {
  async getNotificationGroups(req, res, next) {
    try {
      const groups = await notificationGroups.getNotificationGroups();
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, groups);
    } catch (error) {
      return next(res, error);
    }
  }

  async updateNotificationGroup(req, res, next) {
    try {
      const rec = await notificationGroups.updateNotificationGroups(req.body);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(res, error);
    }
  }
}

module.exports = new NotificationController();
