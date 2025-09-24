/* eslint-disable class-methods-use-this */
const { ObjectId } = require('mongoose').Types;
const { ResponseMessages } = require('src/common/data');
const { ApiResponse, generatePassword } = require('src/common/handlers');

const { accountTypeService, systemEmailService, customerService } = require('src/modules/services');
const { EMAIL_ACTIONS } = require('../../../../common/data/constants');
const service = require('../accounts.service');
const symbolService =require('../../../symbol-info/symbolinfo.service');
class TradingAccountController {
  /**
   * account type functions
   */
  async getAccountTypes(req, res, next) {
    const { type, forCrm } = req.query;
    const query = {
      type: {
        $in: ['DEMO', 'LIVE'],
      },
    };
    if (type) {
      query.type = type;
    }
    if (forCrm) {
      query.forCrm = true;
    }
    try {
      const rec = await accountTypeService.find(query);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async createAccountType(req, res, next) {
    try {
      const params = req.body;
      const rec = await accountTypeService.create(params);
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async updateAccountType(req, res, next) {
    try {
      const { id } = req.params;
      const rec = await accountTypeService.updateById(id, req.body);
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * trading account functions
   */

  async createRecord(req, res, next) {
    try {
      const params = req.body;
      params.userId = req.user && req.user._id;
      const accType = await accountTypeService.findOne({
        _id: req.body.accountTypeId,
        'currencies.currency': req.body.currency,
      });
      if (!accType) {
        return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_FAIL, null);
      }
      const { platform = 'MT5', type = true } = accType;
      params.customer = req.customer;
      const rec = await service.createAccount(params, platform, type === 'DEMO', true, true);
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getPaginate(req, res, next) {
    try {
      const params = req.query;
      if (params.customerId) {
        params.customerId = ObjectId(params.customerId);
      }
      if (params.logins) {
        params.login = {
          $in: params.logins.map((x) => parseInt(x, 10)),
        };
        delete params.logins;
      }
      const rec = await service.getCustomerAccsWithState(params);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getAccounts(req, res, next) {
    try {
      const { type } = req.query;
      const rec = await service.find({
        type,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async updateRecordById(req, res, next) {
    try {
      const { id } = req.params;
      const rec = await service.updateById(id, req.body);
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async deleteRecordById(req, res, next) {
    try {
      const { id } = req.params;
      const rec = await service.deleteById(id);
      return ApiResponse(res, true, ResponseMessages.RECORD_DELETE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getRecords(req, res, next) {
    try {
      const rec = await service.find();
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getRecordById(req, res, next) {
    try {
      const rec = await service.findById(req.params.id);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getRecordByLogin(req, res, next) {
    try {
      const rec = await service.findOne({ login: req.params.login }, {}, {
        populate: [{
          path: 'customerId',
          select: 'firstName lastName email',
        }],
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getRecordPaginated(req, res, next) {
    try {
      const rec = await service.find({});
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async updateRecordStatus(req, res, next) {
    try {
      const { id, status } = req.params;
      const rec = await service.updateById(id, { isActive: status === 'activate' });
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async changeLeverage(req, res, next) {
    try {
      const { id } = req.params;
      const { leverage } = req.body;
      const account = await service.findById(id);
      const rec = await service.changeLeverage(account.login, leverage, account.platform, account.type === 'DEMO');
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const { id } = req.params;
      const { type } = req.body;
      const account = await service.findById(id);
      const customer = await customerService.findById(account.customerId);
      const password = generatePassword();
      const rec = await service.changePassword(account.login, type, password, account.platform, account.type === 'DEMO');
      systemEmailService.sendSystemEmail(EMAIL_ACTIONS.TRADING_ACCOUNT_RESET, {
        to: customer.email,
        lang: customer?.language,
      }, {
        firstName: customer.firstName,
        lastName: customer.lastName,
        login: account.login,
        type,
        password,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async changeGroup(req, res, next) {
    try {
      const rec = await service.changeGroup(req.body, 'CTRADER');
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async linkAccount(req, res, next) {
    try {
      const {
        login, type,
      } = req.body;
      const acc = await service.getAccount(login, 'CTRADER', type === 'DEMO');
      const rec = await service.linkAccount(req.body, type === 'DEMO');
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, {
        ...rec._doc,
        title: rec.title,
        Equity: acc.Credit,
        Balance: acc.Balance,
        Leverage: rec.Leverage,
        Margin: rec.Margin,
        MarginLeverage: rec.MarginLeverage,
        MarginFree: rec.MarginFree,
        MarginLevel: rec.MarginLevel,
        Credit: rec.Credit,
      });
    } catch (error) {
      return next(error);
    }
  }

  async tradingAccess(req, res, next) {
    try {
      const {
        login, isActivating,
      } = req.body;
      const rec = await service.changeAccess(login, isActivating);
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getOpenPositions(req, res, next) {
    try {
      const params = req.query;
      const account = await service.findById(req.params.id);
      const symbols = await symbolService.getSymbolInfo();      
      const rec = await service.getOpenPositions(
        account.login, params.page, params.limit, account.platform, account.type === 'DEMO',
      );
      if(symbols){
        return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, {positions: rec, symbols});  
      }
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getClosedPositions(req, res, next) {
    try {
      const params = req.query;
      const account = await service.findById(req.params.id);
      const rec = await service.getClosedPositions(
        account.login, params.page, params.limit, account.platform, account.type === 'DEMO',
      );
      const symbols = await symbolService.getSymbolInfo();
      if(symbols){
        return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, {positions: rec, symbols});  
      }
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new TradingAccountController();
