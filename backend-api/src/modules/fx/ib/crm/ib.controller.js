/* eslint-disable class-methods-use-this */
const { ObjectId } = require('mongoose').Types;
const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');

const {
  accountTypeService,
  customerService,
  accountService,
  dealsService,
  fxTransactionService,
  walletService,
} = require('src/modules/services');
const { flatToNested } = require('../../../../utils/flatToNested');
const { flattenParents } = require('../../../../utils/flattenObject');

class IBController {
  async createIbAccount(req, res, next) {
    try {
      const { id, status } = req.params;
      const rec = await accountService.createIbAccount({
        customer: req.customer,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getClientReferrals(req, res, next) {
    try {
      const clients = await customerService.getChilds(
        req.params.clientId, req.query.type, req.query.dateFrom, req.query.dateTo,
      );
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, flatToNested(clients));
    } catch (error) {
      return next(error);
    }
  }

  async getIbParents(req, res, next) {
    try {
      const parents = await customerService.getIbParents(req.params.clientId);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, flattenParents(parents));
    } catch (error) {
      return next(error);
    }
  }

  async getStatement(req, res, next) {
    try {
      // const params = req.query;
      // const ib = req.customer.fx[params.platform === 'MT5' ? 'ibMT5Acc' :
      //                             params.platform === 'CTRADER' ? 'ibCTRADERAcc'
      //                             : 'ibMT4Acc'][0];
      // const statement = await dealsService.getStatement(ib, req.query);
      const ibWallet = await walletService.getWalletByCustomerId(req.customer._id);
      const statement = await dealsService.getStatement(ibWallet?._id?.toString(), req.query);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, statement);
    } catch (error) {
      return next(error);
    }
  }

  async getStDeals(req, res, next) {
    try {
      // const params = req.query;
      // const ib = req.customer.fx[params.platform === 'MT5' ? 'ibMT5Acc' :
      //                             params.platform === 'CTRADER' ? 'ibCTRADERAcc'
      //                             : 'ibMT4Acc'][0];
      // const statement = await dealsService.getStatementDeals(ib, req.query);
      // const params = req.query;
      // const ib = req.customer.fx[params.platform === 'MT5' ? 'ibMT5Acc' : 'ibMT4Acc'][0];
      const ibWallet = await walletService.getWalletByCustomerId(req.customer._id);
      const statement = await dealsService.getStatementDeals(ibWallet?._id?.toString(), req.query);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, statement);
    } catch (error) {
      return next(error);
    }
  }

  async linkClient(req, res, next) {
    try {
      const client = await customerService.linkClient(req.params.clientId, req.body, req.user._id);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, client);
    } catch (error) {
      return next(error);
    }
  }

  async unLinkIb(req, res, next) {
    try {
      const client = await customerService.unLinkIb(req.params.clientId, req.user._id);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, client);
    } catch (error) {
      return next(error);
    }
  }

  async unLinkClients(req, res, next) {
    const { clientIds } = req.body;
    try {
      const client = await customerService.unLinkClients(clientIds, req.user._id);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, client);
    } catch (error) {
      return next(error);
    }
  }

  async makeInternalTransfer(req, res, next) {
    try {
      const params = req.body;
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
