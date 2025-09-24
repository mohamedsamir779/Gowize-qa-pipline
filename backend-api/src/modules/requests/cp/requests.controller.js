/* eslint-disable class-methods-use-this */
const { ResponseMessages } = require('src/common/data');
const { ApiResponse, SendEvent } = require('src/common/handlers');
const { CONSTANTS } = require('src/common/data');

const {
  requestsService,
  accountTypeService,
} = require('src/modules/services');
const { PUSH_NOTIFICATION_GROUPS } = require('../../../common/data/constants');

const {
  LOG_TYPES,
  LOG_LEVELS,
  EVENT_TYPES,
} = CONSTANTS;

class RequestController {
  async createIbRequest(req, res, next) {
    try {
      const reqObj = await requestsService.getIbRequest(req.user._id);
      if (reqObj) {
        return ApiResponse(
          res, true, ResponseMessages.RECORD_CREATE_FAIL, null,
        );
      }
      const request = await requestsService.createIbRequest(req.user._id);
      SendEvent(
        EVENT_TYPES.EVENT_LOG,
        LOG_TYPES.IB_REQUEST,
        {
          customerId: req.user._id,
          userId: null,
          triggeredBy: 0,
          userLog: false,
          level: LOG_LEVELS.INFO,
          details: {},
          content: {
            requestId: request?.recordId,
          },
        },
      );
      SendEvent(
        EVENT_TYPES.PUSH_NOTIFICATION,
        {
          pushNotificationType: PUSH_NOTIFICATION_GROUPS.REQUEST.IB_REQUEST__PENDING,
          pushNotificationGroup: Object.keys(PUSH_NOTIFICATION_GROUPS).find((key) => key === 'REQUEST'),
          to: [req.user.agent],
        },
        {
          client: {
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            recordId: req.user.recordId,
            _id: req.user._id.toString(),
          },
          request: {
            recordId: request.recordId,
            type: CONSTANTS.REQUESTS_TYPES.IB_REQUEST,
            status: CONSTANTS.TRANSACTIONS_STATUS.PENDING,
          },
        },
      );
      return ApiResponse(
        res, true, ResponseMessages.RECORD_FETCH_SUCCESS, request,
      );
    } catch (error) {
      return next(error);
    }
  }

  async getIbRequest(req, res, next) {
    try {
      const reqObj = await requestsService.getIbRequest(req.user._id);
      return ApiResponse(
        res, true, ResponseMessages.RECORD_FETCH_SUCCESS, reqObj,
      );
    } catch (error) {
      return next(error);
    }
  }

  async createChangeLeverageRequest(req, res, next) {
    try {
      const request = await requestsService.createChangeLeverageRequest(req.user._id, req.body);
      const { login, from, to } = request.content;
      SendEvent(
        EVENT_TYPES.EVENT_LOG,
        LOG_TYPES.LEVERAGE_REQUEST,
        {
          customerId: req.user._id,
          userId: null,
          triggeredBy: 0,
          userLog: false,
          level: LOG_LEVELS.INFO,
          details: {},
          content: {
            from,
            to,
            login,
            requestId: request?.recordId,
          },
        },
      );
      SendEvent(
        EVENT_TYPES.PUSH_NOTIFICATION,
        {
          pushNotificationType: PUSH_NOTIFICATION_GROUPS.REQUEST.LEVERAGE_REQUEST__PENDING,
          pushNotificationGroup: Object.keys(PUSH_NOTIFICATION_GROUPS).find((key) => key === 'REQUEST'),
          to: [req.user.agent],
        },
        {
          client: {
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            recordId: req.user.recordId,
            _id: req.user._id.toString(),
          },
          request: {
            recordId: request.recordId,
            type: CONSTANTS.REQUESTS_TYPES.IB_REQUEST,
            status: CONSTANTS.TRANSACTIONS_STATUS.PENDING,
            login,
            from,
            to,
          },
        },
      );
      req.requestId = request;
      next();
    } catch (error) {
      return next(error);
    }
  }

  async createAccountRequest(req, res, next) {
    try {
      const params = req.body;
      const accType = await accountTypeService.findOne({
        _id: req.body.accountTypeId,
        'currencies.currency': req.body.currency,
      });
      if (!accType) {
        return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_FAIL, null);
      }
      const { platform = 'MT5', type = true } = accType;
      const request = await requestsService.createAccountRequest(
        req.user._id,
        accType,
        {
          ...params,
          platform,
          type,
        },
      );
      SendEvent(
        EVENT_TYPES.EVENT_LOG,
        LOG_TYPES.CREATE_ACCOUNT_REQUEST,
        {
          customerId: req.user._id,
          userId: null,
          triggeredBy: 0,
          userLog: false,
          level: LOG_LEVELS.INFO,
          details: {},
          content: {
            ...params,
            platform,
            type,
            requestId: request?.recordId,
            status: 'PENDING',
          },
        },
      );
      SendEvent(
        EVENT_TYPES.PUSH_NOTIFICATION,
        {
          pushNotificationType: PUSH_NOTIFICATION_GROUPS.REQUEST.ACCOUNT_REQUEST__PENDING,
          pushNotificationGroup: Object.keys(PUSH_NOTIFICATION_GROUPS).find((key) => key === 'REQUEST'),
          to: [req.user.agent],
        },
        {
          client: {
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            recordId: req.user.recordId,
            _id: req.user._id.toString(),
          },
          request: {
            recordId: request.recordId,
            type: CONSTANTS.REQUESTS_TYPES.IB_REQUEST,
            status: CONSTANTS.TRANSACTIONS_STATUS.PENDING,
            platform,
            group: accType.group,
          },
        },
      );
      return ApiResponse(res, true, ResponseMessages.ACCOUNT_REQUEST_CREATE_SUCCESS, request);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new RequestController();
