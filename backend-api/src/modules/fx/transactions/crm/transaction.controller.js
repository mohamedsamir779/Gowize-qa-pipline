//
/* eslint-disable class-methods-use-this */
const { ObjectId } = require('mongoose').Types;
const { ResponseMessages, CONSTANTS } = require('src/common/data');
const { ApiResponse, addAgentToQuery } = require('src/common/handlers');
const service = require('../transaction.service');
const tradingAccountService = require('../../accounts/accounts.service');

class TransactionController {
  // deposit functions
  async makeDeposit(req, res, next) {
    try {
      const params = req.body;
      params.userId = req.user._id;
      const deposit = await service.addApprovedDeposit(params, req.tradingAccount);
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, deposit);
    } catch (error) {
      return next(error);
    }
  }

  async getDeposits(req, res, next) {
    try {
      let { query = {} } = req;
      query = addAgentToQuery(req.user, query);
      const rec = await service.getDeposits(query);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getDepositGateways(req, res, next) {
    try {
      const rec = service.getDepositGateways();
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async approveDeposit(req, res, next) {
    try {
      const rec = await service.approveDeposit({
        customerId: req.body.customerId,
        userId: req.user._id,
        id: req.params.id,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async rejectDeposit(req, res, next) {
    try {
      const rec = service.rejectDeposit({
        customerId: req.body.customerId,
        userId: req.user._id,
        id: req.params.id,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  // withdrawals functions
  async makeWithdrawal(req, res, next) {
    try {
      const params = req.body;
      params.userId = req.user._id;
      const deposit = await service.addApprovedWithdrawal(params, req.tradingAccount);

      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, deposit);
    } catch (error) {
      return next(error);
    }
  }

  async getWithdrawals(req, res, next) {
    try {
      let { query = {} } = req;
      query = addAgentToQuery(req.user, query);
      const rec = await service.getWithdrawals(query);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getWithdrawalGateways(req, res, next) {
    try {
      const rec = service.getWithdrawalGateways();
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  // internal transfer functions
  async makeInternalTransfer(req, res, next) {
    try {
      const params = req.body;
      params.userId = req.user._id;
      const deposit = await service.addApprovedInternalTransfer(
        params,
        params.tradingAccountFrom,
        params.tradingAccountTo,
      );
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, deposit);
    } catch (error) {
      return next(error);
    }
  }

  async getInternalTransfers(req, res, next) {
    try {
      let { query = {} } = req;
      query = addAgentToQuery(req.user, query);
      const rec = await service.getInternalTransfers(query);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  // credit functions
  async makeCredit(req, res, next) {
    try {
      const params = req.body;
      params.userId = req.user._id;
      const deposit = await service.addApprovedCreditInOut(params, req.tradingAccount);
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, deposit);
    } catch (error) {
      return next(error);
    }
  }

  async getCredits(req, res, next) {
    try {
      let { query = {} } = req;
      query = addAgentToQuery(req.user, query);
      const rec = await service.getCredits(query);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async approveWithdraw(req, res, next) {
    try {
      const rec = await service.approveWithdrawal({
        customerId: req.body.customerId,
        userId: req.user._id,
        id: req.params.id,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async rejectWithdraw(req, res, next) {
    try {
      const rec = await service.rejectWithdrawal({
        customerId: req.body.customerId,
        userId: req.user._id,
        id: req.params.id,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async approveInternalTransfer(req, res, next) {
    try {
      const rec = await service.approveInternalTransfer({
        id: req.params.id,
        userId: req.user._id,
        amount: req.body.amount,
      });
      return ApiResponse(res, true, ResponseMessages.INTERNAL_TRANSFER_CREATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async rejectInternalTransfer(req, res, next) {
    try {
      const record = await service.rejectInternalTransfer({
        userId: req.user._id,
        id: req.params.id,
      });
      return ApiResponse(res, true, ResponseMessages.INTERNAL_TRANSFER_REJECT_SUCCESS, record);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new TransactionController();
