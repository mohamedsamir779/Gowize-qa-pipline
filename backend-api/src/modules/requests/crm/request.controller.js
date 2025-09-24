//
const allServices = require('src/modules/services');
const { ResponseMessages, CONSTANTS } = require('src/common/data');
const { ApiResponse, SendEvent, addAgentToQuery } = require('src/common/handlers');
const { PUSH_NOTIFICATION_GROUPS } = require('../../../common/data/constants');

const { requestsService: service, accountService } = allServices;

const {
  LOG_TYPES,
  LOG_LEVELS,
  EVENT_TYPES,
} = CONSTANTS;
class RequestController {
  async getIbRequests(req, res, next) {
    try {
      let { query = {} } = req;
      query = addAgentToQuery(req.user, query);
      const rec = await service.getIbRequests(query);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async approveIbRequest(req, res, next) {
    try {
      const reqObj = await service.findOne({
        _id: req.body.requestId,
        type: CONSTANTS.REQUESTS_TYPES.PARTNERSHIP,
        status: CONSTANTS.REQUESTS_STATUS.PENDING,
      }, null, {
        populate: [{
          path: 'customerId',
          select: 'firstName lastName category email _id fx recordId',
        }],
      });
      if (
        (!reqObj)
        || (
          reqObj
          && reqObj.customerId
          && reqObj.customerId.fx
          && (reqObj.customerId.fx.ibMT5Acc.length > 0
            || reqObj.customerId.fx.ibMT4Acc.length > 0
            || reqObj.customerId.fx.ibCTRADERAcc.length > 0)
        )) {
        return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_FAIL, false);
      }
      const accs = await accountService.createIbAccount({
        customer: reqObj.customerId,
      });
      await service.updateById(req.body.requestId, { status: CONSTANTS.REQUESTS_STATUS.APPROVED });
      SendEvent(
        EVENT_TYPES.EVENT_LOG,
        LOG_TYPES.UPDATE_IB_REQUEST,
        {
          customerId: reqObj.customerId?._id,
          userId: req.user._id,
          triggeredBy: 1,
          userLog: false,
          level: LOG_LEVELS.INFO,
          details: {},
          content: {
            status: CONSTANTS.REQUESTS_STATUS.APPROVED,
          },
        },
      );
      SendEvent(
        EVENT_TYPES.PUSH_NOTIFICATION,
        {
          pushNotificationType: PUSH_NOTIFICATION_GROUPS.REQUEST.IB_REQUEST__APPROVED,
          pushNotificationGroup: Object.keys(PUSH_NOTIFICATION_GROUPS).find((key) => key === 'REQUEST'),
          to: [reqObj.customerId._id],
        },
        {
          client: {
            firstName: reqObj.customerId.firstName,
            lastName: reqObj.customerId.lastName,
            email: reqObj.customerId.email,
            recordId: reqObj.customerId.recordId,
            _id: reqObj.customerId._id.toString(),
          },
          request: {
            recordId: reqObj.recordId,
            type: CONSTANTS.REQUESTS_TYPES.IB_REQUEST,
            status: CONSTANTS.TRANSACTIONS_STATUS.APPROVED,
          },
        },
      );
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, accs);
    } catch (error) {
      return next(error);
    }
  }

  async rejectIbRequest(req, res, next) {
    try {
      const reqObj = await service.findOne({
        _id: req.body.requestId,
        type: CONSTANTS.REQUESTS_TYPES.PARTNERSHIP,
        status: CONSTANTS.REQUESTS_STATUS.PENDING,
      }, null, {
        populate: [{
          path: 'customerId',
          select: 'firstName lastName category email _id fx recordId',
        }],
      });

      await service.updateById(req.body.requestId, { status: CONSTANTS.REQUESTS_STATUS.REJECTED });
      SendEvent(
        EVENT_TYPES.EVENT_LOG,
        LOG_TYPES.UPDATE_IB_REQUEST,
        {
          customerId: reqObj.customerId._id,
          userId: req.user._id,
          triggeredBy: 1,
          userLog: false,
          level: LOG_LEVELS.INFO,
          details: {},
          content: {
            status: CONSTANTS.REQUESTS_STATUS.REJECTED,
          },
        },
      );
      SendEvent(
        EVENT_TYPES.PUSH_NOTIFICATION,
        {
          pushNotificationType: PUSH_NOTIFICATION_GROUPS.REQUEST.IB_REQUEST__REJECTED,
          pushNotificationGroup: Object.keys(PUSH_NOTIFICATION_GROUPS).find((key) => key === 'REQUEST'),
          to: [reqObj.customerId._id],
        },
        {
          client: {
            firstName: reqObj.customerId.firstName,
            lastName: reqObj.customerId.lastName,
            email: reqObj.customerId.email,
            recordId: reqObj.customerId.recordId,
            _id: reqObj.customerId._id.toString(),
          },
          request: {
            recordId: reqObj.recordId,
            type: CONSTANTS.REQUESTS_TYPES.IB_REQUEST,
            status: CONSTANTS.TRANSACTIONS_STATUS.REJECTED,
          },
        },
      );
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, true);
    } catch (error) {
      return next(error);
    }
  }

  async getLeverageRequest(req, res, next) {
    try {
      let { query = {} } = req;
      query = addAgentToQuery(req.user, query);
      const rec = await service.getLeverageRequests(query);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async approveLeverageRequest(req, res, next) {
    const { _id } = req.requestId;
    try {
      const reqObj = await service.findOne({
        _id,
        type: CONSTANTS.REQUESTS_TYPES.LEVERAGE,
        status: CONSTANTS.REQUESTS_STATUS.PENDING,
      }, null, {
        populate: [{
          path: 'customerId',
          select: 'firstName lastName category email _id fx recordId',
        }],
      });
      if (!reqObj) {
        return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_FAIL, false);
      }
      // eslint-disable-next-line max-len, no-undef
      const userAcc = await accountService.findOne({ login: reqObj.content.login });
      // eslint-disable-next-line max-len
      const accs = await accountService.changeLeverage(reqObj.content.login, reqObj.content.to, userAcc.platform, userAcc.type === 'DEMO');
      await service.updateById(_id, { status: CONSTANTS.REQUESTS_STATUS.APPROVED, 'content.platform': userAcc.platform });
      SendEvent(
        EVENT_TYPES.EVENT_LOG,
        LOG_TYPES.UPDATE_LEVERAGE_REQUEST,
        {
          customerId: reqObj.customerId?._id,
          userId: req.user._id,
          triggeredBy: 1,
          userLog: false,
          level: LOG_LEVELS.INFO,
          details: {},
          content: {
            requestId: reqObj.recordId,
            from: reqObj.content.from,
            to: reqObj.content.to,
            login: reqObj.content.login,
            status: CONSTANTS.REQUESTS_STATUS.APPROVED,
          },
        },
      );
      SendEvent(
        EVENT_TYPES.PUSH_NOTIFICATION,
        {
          pushNotificationType: PUSH_NOTIFICATION_GROUPS.REQUEST.LEVERAGE_REQUEST__APPROVED,
          pushNotificationGroup: Object.keys(PUSH_NOTIFICATION_GROUPS).find((key) => key === 'REQUEST'),
          to: [reqObj.customerId._id],
        },
        {
          client: {
            firstName: reqObj.customerId.firstName,
            lastName: reqObj.customerId.lastName,
            email: reqObj.customerId.email,
            recordId: reqObj.customerId.recordId,
            _id: reqObj.customerId._id.toString(),
          },
          request: {
            recordId: reqObj.recordId,
            type: CONSTANTS.REQUESTS_TYPES.LEVERAGE,
            status: CONSTANTS.TRANSACTIONS_STATUS.APPROVED,
            from: reqObj.content.from,
            to: reqObj.content.to,
            login: reqObj.content.login,
          },
        },
      );
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, accs);
    } catch (error) {
      return next(error);
    }
  }

  async rejectLeverageRequest(req, res, next) {
    try {
      const reqObj = await service.findOne({
        _id: req.body.requestId,
        type: CONSTANTS.REQUESTS_TYPES.LEVERAGE,
        status: CONSTANTS.REQUESTS_STATUS.PENDING,
      });
      await service.updateById(req.body.requestId, { status: CONSTANTS.REQUESTS_STATUS.REJECTED });
      SendEvent(
        EVENT_TYPES.EVENT_LOG,
        LOG_TYPES.UPDATE_LEVERAGE_REQUEST,
        {
          customerId: reqObj.customerId?._id,
          userId: req.user._id,
          triggeredBy: 1,
          userLog: false,
          level: LOG_LEVELS.INFO,
          details: {},
          content: {
            requestId: reqObj.recordId,
            from: reqObj.content.from,
            to: reqObj.content.to,
            login: reqObj.content.login,
            status: CONSTANTS.REQUESTS_STATUS.REJECTED,
          },
        },
      );
      SendEvent(
        EVENT_TYPES.PUSH_NOTIFICATION,
        {
          pushNotificationType: PUSH_NOTIFICATION_GROUPS.REQUEST.LEVERAGE_REQUEST__REJECTED,
          pushNotificationGroup: Object.keys(PUSH_NOTIFICATION_GROUPS).find((key) => key === 'REQUEST'),
          to: [reqObj.customerId._id],
        },
        {
          client: {
            firstName: reqObj.customerId.firstName,
            lastName: reqObj.customerId.lastName,
            email: reqObj.customerId.email,
            recordId: reqObj.customerId.recordId,
            _id: reqObj.customerId._id.toString(),
          },
          request: {
            recordId: reqObj.recordId,
            type: CONSTANTS.REQUESTS_TYPES.LEVERAGE,
            status: CONSTANTS.TRANSACTIONS_STATUS.REJECTED,
            from: reqObj.content.from,
            to: reqObj.content.to,
            login: reqObj.content.login,
          },
        },
      );
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, true);
    } catch (error) {
      return next(error);
    }
  }

  async getAccountRequests(req, res, next) {
    try {
      let { query = {} } = req;
      query = addAgentToQuery(req.user, query);
      const rec = await service.getAccountRequests(query);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async approveAccountRequest(req, res, next) {
    try {
      const reqObj = await service.findOne({
        _id: req.body.requestId,
        type: CONSTANTS.REQUESTS_TYPES.ACCOUNT,
        status: CONSTANTS.REQUESTS_STATUS.PENDING,
      }, null, {
        populate: [{
          path: 'customerId',
          select: 'firstName lastName category email _id fx recordId',
        }],
      });
      if (!reqObj) {
        return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_FAIL, false);
      }
      const { content } = reqObj;
      const leverage = content.from;
      await accountService.createAccount(
        {
          accountTypeId: content.accountTypeId,
          customer: reqObj.customerId,
          leverage: leverage,
          currency: content.currency,
          userId: req.user._id,
        },
        content.platform,
        content.type === 'DEMO', true,
      );
      SendEvent(
        EVENT_TYPES.PUSH_NOTIFICATION,
        {
          pushNotificationType: PUSH_NOTIFICATION_GROUPS.REQUEST.ACCOUNT_REQUEST__APPROVED,
          pushNotificationGroup: Object.keys(PUSH_NOTIFICATION_GROUPS).find((key) => key === 'REQUEST'),
          to: [reqObj.customerId._id],
        },
        {
          client: {
            firstName: reqObj.customerId.firstName,
            lastName: reqObj.customerId.lastName,
            email: reqObj.customerId.email,
            recordId: reqObj.customerId.recordId,
            _id: reqObj.customerId._id.toString(),
          },
          request: {
            recordId: reqObj.recordId,
            type: CONSTANTS.REQUESTS_TYPES.ACCOUNT,
            status: CONSTANTS.TRANSACTIONS_STATUS.APPROVED,
            accountType: content.accountTypeId,
          },
        },
      );
      await service.updateById(req.body.requestId, { status: CONSTANTS.REQUESTS_STATUS.APPROVED });
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, []);
    } catch (error) {
      return next(error);
    }
  }

  async rejectAccountRequest(req, res, next) {
    try {
      const reqObj = await service.findOne({
        _id: req.body.requestId,
        type: CONSTANTS.REQUESTS_TYPES.ACCOUNT,
        status: CONSTANTS.REQUESTS_STATUS.PENDING,
      }, null, {
        populate: [{
          path: 'customerId',
          select: 'firstName lastName category email _id fx recordId',
        }],
      });
      if (!reqObj) {
        return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_FAIL, false);
      }
      await service.updateById(req.body.requestId, { status: CONSTANTS.REQUESTS_STATUS.REJECTED });
      SendEvent(
        EVENT_TYPES.EVENT_LOG,
        LOG_TYPES.UPDATE_ACCOUNT_REQUEST,
        {
          customerId: reqObj.customerId?._id,
          userId: req.user._id,
          triggeredBy: 1,
          userLog: false,
          level: LOG_LEVELS.INFO,
          details: {},
          content: {
            requestId: reqObj.recordId,
            status: CONSTANTS.REQUESTS_STATUS.REJECTED,
          },
        },
      );
      SendEvent(
        EVENT_TYPES.PUSH_NOTIFICATION,
        {
          pushNotificationType: PUSH_NOTIFICATION_GROUPS.REQUEST.ACCOUNT_REQUEST__REJECTED,
          pushNotificationGroup: Object.keys(PUSH_NOTIFICATION_GROUPS).find((key) => key === 'REQUEST'),
          to: [reqObj.customerId._id],
        },
        {
          client: {
            firstName: reqObj.customerId.firstName,
            lastName: reqObj.customerId.lastName,
            email: reqObj.customerId.email,
            recordId: reqObj.customerId.recordId,
            _id: reqObj.customerId._id.toString(),
          },
          request: {
            recordId: reqObj.recordId,
            type: CONSTANTS.REQUESTS_TYPES.ACCOUNT,
            status: CONSTANTS.TRANSACTIONS_STATUS.REJECTED,
            accountType: reqObj.content.accountTypeId,
          },
        },
      );
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, true);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new RequestController();
