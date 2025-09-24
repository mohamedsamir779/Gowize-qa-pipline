/* eslint-disable class-methods-use-this */
const { ObjectId } = require('mongoose').Types;
const { ResponseMessages, CONSTANTS } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');

const {
  customerService,
  accountService,
  fxTransactionService,
  ibAgrementService,
  dealsService,
  walletService,
} = require('src/modules/services');
const { flatToNested } = require('../../../../utils/flatToNested');

class IBController {
  async getIbAccounts(req, res, next) {
    try {
      const query = {
        customerId: req.user._id,
        type: CONSTANTS.TRADING_ACCOUNT_TYPES.IB,
      };
      const accounts = await accountService.getCustomerAccsWithState(query);
      // eslint-disable-next-line max-len
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, (accounts && accounts.docs) || []);
    } catch (error) {
      return next(error);
    }
  }

  async getMyClients(req, res, next) {
    try {
      const clients = await customerService.getChilds(
        req.user._id, req.query.type, req.query.dateFrom, req.query.dateTo,
      );
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, clients);
    } catch (error) {
      return next(error);
    }
  }

  async isMyClientMw(req, res, next) {
    const parents = await customerService.getParents(req.query.customerId);
    if (!parents.find((obj) => obj._id.toString() === req.user._id.toString())) {
      return ApiResponse(res, false, ResponseMessages.RECORD_FETCH_NOT_FOUND, null);
    }
    return next();
  }

  async areMyClientsMw(req, res, next) {
    const allCustomersId = req.query.customersId.split(',');
    for ( const element of allCustomersId){
      const parents = await customerService.getParents(element);
      if (!parents.find((obj) => obj._id.toString() === req.user._id.toString())) {
        return ApiResponse(res, false, ResponseMessages.RECORD_FETCH_NOT_FOUND, null);
      }
    }
    return next();
  }

  async isMyClientAccMw(req, res, next) {
    const account = await accountService.getAccWithParents(req.query.tradingAccountId);
    if (
      !account.parents
      || !account.parents.find((obj) => obj._id.toString() === req.user._id.toString())) {
      return ApiResponse(res, false, ResponseMessages.RECORD_FETCH_NOT_FOUND, null);
    }
    req.account = account;
    return next();
  }

  async getMyClientAccounts(req, res, next) {
    try {
      const accounts = await accountService.getCustomerAccsWithState(req.query);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, accounts);
    } catch (error) {
      return next(error);
    }
  }

  async getAllClientsAccounts(req, res, next) {
    const allCustomersId = req.query.customersId.split(',');
    const accounts = [];
    try {
      for (const element of allCustomersId){
        const result = await accountService.getCustomerAccsWithState({ customerId: element, type: req.query.type });
        accounts.push(result);
      }
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, accounts);
    } catch (error) {
      return next(error);
    }
  }

  async getOpenPositions(req, res, next) {
    try {
      const params = req.query;
      const account = req.account || await accountService.findById(params.tradingAccountId);
      if (!account) {
        return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_NOT_FOUND, null);
      }
      const rec = await accountService.getOpenPositions(account.login, params.page, params.limit, account.platform, account.type === 'DEMO');
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getClosePositions(req, res, next) {
    try {
      const params = req.query;
      const account = req.account || await accountService.findById(params.tradingAccountId);
      if (!account) {
        return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_NOT_FOUND, null);
      }
      const rec = await accountService.getClosedPositions(account.login, params.page, params.limit, account.platform, account.type === 'DEMO');
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getClientTransactions(req, res, next) {
    try {
      const { type, ...params } = req.query;
      const clients = await customerService.getChilds(req.user._id, 'live');
      params.customerId = {
        $in: (clients[0] && clients[0].childs && clients[0].childs.map((obj) => obj._id)) || [],
      };
      const transactions = await fxTransactionService.getTransactions(params, type === 'DEPOSIT', type === 'WITHDRAW');
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, transactions);
    } catch (error) {
      return next(error);
    }
  }

  async getAgrements(req, res, next) {
    try {
      const agreements = await ibAgrementService.getInvolvedAgreements(req.user._id);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, agreements);
    } catch (error) {
      return next(error);
    }
  }

  async getClientReferrals(req, res, next) {
    try {
      const clients = await customerService.getChilds(
        req.user._id, req.query.type, req.query.dateFrom, req.query.dateTo,
      );
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, flatToNested(clients));
    } catch (error) {
      return next(error);
    }
  }

  async getStatement(req, res, next) {
    try {
      const params = req.query;
      const clientAccounts = await customerService.getClientLiveAccs(
        req.customer._id, params.platform,
      );
      // const ib = req.customer.fx[params.platform === 'MT5' ? 'ibMT5Acc' :
      //                             params.platform === 'CTRADER' ? 'ibCTRADERAcc'
      //                             : 'ibMT4Acc'][0];
      // const statement = await dealsService.getStatement(ib, req.query, clientAccounts);
      const ibWallet = await walletService.getWalletByCustomerId(req.customer._id);
      // const ib = req.customer.fx[params.platform === 'MT5' ? 'ibMT5Acc' : 'ibMT4Acc'][0];
      const statement = await dealsService.getStatement(
        ibWallet?._id?.toString(),
        req.query,
        clientAccounts,
      );
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, statement);
    } catch (error) {
      return next(error);
    }
  }

  async getStDeals(req, res, next) {
    try {
      const params = req.query;
      // const ib = req.customer.fx[params.platform === 'MT5' ? 'ibMT5Acc' :
      //                             params.platform === 'CTRADER' ? 'ibCTRADERAcc'
      //                             : 'ibMT4Acc'][0];
      // const statement = await dealsService.getStatementDeals(ib, params);
      // const ib = req.customer.fx[params.platform === 'MT5' ? 'ibMT5Acc' : 'ibMT4Acc'][0];
      const ibWallet = await walletService.getWalletByCustomerId(req.customer._id);
      const statement = await dealsService.getStatementDeals(ibWallet?._id?.toString(), params);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, statement);
    } catch (error) {
      return next(error);
    }
  }

  async getSummary(req, res, next) {
    try {
      const accounts = await customerService.getClientLiveAccs(req.user._id, req.query.platform);

      const [
        totalLiveclients,
        transactions,
        clientsEquity,
        ibEquity,
      ] = await Promise.all([
        customerService.getChildsCount(req.user._id),
        fxTransactionService.getDepositWithdrawSumByTradingAccount(accounts),
        accountService.getEquityIbSummary(
          accounts.map((obj) => obj.login), req.query.platform,
        ),
        accountService.getEquityIbSummary(
          req.customer.fx[req.query.platform === 'MT5' ? 'ibMT5Acc'
                           : req.query.platform === 'CTRADER' ? 'ibCTRADERAcc'
                            : 'ibMT4Acc'], req.query.platform,
        ),
      ]);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, {
        clientsEquity,
        ibEquity,
        ...transactions,
        ...totalLiveclients,
      });
    } catch (error) {
      return next(error);
    }
  }

  async addQuestionnaire(req, res, next) {
    try {
      const result = await customerService.updateQuestionnaire({
        ...req.body,
        customer: req.user,
      });
      if (result) {
        await customerService.updateById(req.user._id, {
          'stages.ib.ibQuestionnaire': true,
        });
      }
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, result);
    } catch (error) {
      return next(error);
    }
  }

  async makeInternalTransfer(req, res, next) {
    try {
      const params = req.body;
      params.customerId = req.user._id;
      const deposit = await fxTransactionService.addIbApprovedInternalTransfer(params,
        params.tradingAccountFrom,
        params.tradingAccountTo);

      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, deposit);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new IBController();
