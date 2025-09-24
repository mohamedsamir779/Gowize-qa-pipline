/* eslint-disable class-methods-use-this */
const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');
const { accountTypeService } = require('src/modules/services');
const service = require('../accounts.service');

class TradingAccountController {
  async getAccountTypes(req, res, next) {
    const query = {
      type: {
        $in: ['DEMO', 'LIVE'],
      },
    };
    if (req.query.forCp) {
      query.forCp = true;
    }
    try {
      const rec = await accountTypeService.find(query, 'title platform currencies leverages type');
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async createRecord(req, res, next) {
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
      params.customer = req.customer;
      const rec = await service.createAccount(params, platform, type === 'DEMO');
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS,
        { ...rec, customer: { ...params.customer } });
    } catch (error) {
      return next(error);
    }
  }

  async getPaginate(req, res, next) {
    try {
      const params = req.query;
      params.customerId = req.user._id;
      const rec = await service.getCustomerAccsWithState(params);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getRecordById(req, res, next) {
    try {
      const rec = await service.getCustomerAccsWithState({
        customerId: req.user._id,
        _id: req.params.id,
      });
      const data = (rec && rec.docs && rec.docs[0]) || null;
      if (data) {
        return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, data);
      }
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_NOT_FOUND, null);
    } catch (error) {
      return next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const { id } = req.params;
      const { type, password } = req.body;
      const account = req.tradingAccount;
      const rec = await service.changePassword(account.login, type, password, account.platform, account.type === 'DEMO');
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async changeLeverage(req, res, next) {
    try {
      const { id } = req.params;
      const { leverage } = req.body;
      const account = req.tradingAccount;

      const rec = await service.changeLeverage(account.login, leverage, account.platform, account.type === 'DEMO');
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getOpenPositions(req, res, next) {
    try {
      const params = req.query;
      const account = req.tradingAccount;
      params.login = account.login;

      const rec = await service.getOpenPositions(
        account.login, params.page, params.limit, account.platform, account.type === 'DEMO',
      );
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getClosedPositions(req, res, next) {
    try {
      const params = req.query;
      const account = req.tradingAccount;
      params.login = account.login;

      const rec = await service.getClosedPositions(
        account.login, params.page, params.limit, account.platform, account.type === 'DEMO',
      );
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new TradingAccountController();
