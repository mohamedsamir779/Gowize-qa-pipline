//
/* eslint-disable class-methods-use-this */
const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');
const { SendEvent } = require('src/common/handlers');
const { EVENT_TYPES, LOG_TYPES, LOG_LEVELS } = require('src/common/data/constants');
const service = require('../sync.service');

class SyncController {
  async getDeals(req, res, next) {
    try {
      const record = await service.getDeals(req.body);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, record);
    } catch (error) {
      return next(error);
    }
  }

  async syncDeals(req, res, next) {
    try {
      const userId = req.user._id;
      SendEvent(
        EVENT_TYPES.EVENT_LOG,
        LOG_TYPES.SYNC_DEALS,
        {
          customerId: null,
          userId,
          triggeredBy: 1,
          userLog: true,
          level: LOG_LEVELS.INFO,
          details: {},
          content: req.body,
        },
      );
      const record = await service.syncDeals(req.body);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, record);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new SyncController();
