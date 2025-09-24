//
/* eslint-disable class-methods-use-this */
const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');
const service = require('../transaction.service');

class TransactionController {
  // deposit functions
  async makeDeposit(req, res, next) {
    try {
      const params = req.body;
      params.customerId = req.user._id;
      const deposit = await service.addPendingDeposit(params, req.tradingAccount, req.file);
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, deposit);
    } catch (error) {
      return next(error);
    }
  }

  async getDeposits(req, res, next) {
    try {
      const params = req.query;
      params.customerId = req.user._id;
      const rec = await service.getDeposits(params);
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

  // withdrawals functions
  async makeWithdrawal(req, res, next) {
    try {
      const params = req.body;
      params.customerId = req.user._id;
      const deposit = await service.addPendingWithdrawal(params, req.tradingAccount);

      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, deposit);
    } catch (error) {
      return next(error);
    }
  }

  async getWithdrawals(req, res, next) {
    try {
      const params = req.query;
      params.customerId = req.user._id;
      const rec = await service.getWithdrawals(params);
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
  async createInternalTransferRequest(req, res, next) {
    try {
      const params = req.body;
      params.customerId = req.user._id;
      // const requestDetails = await service.addPendingInternalTransfer(
      //   params,
      //   params.tradingAccountFrom,
      //   params.tradingAccountTo,
      // );
      const deposit = await service.addApprovedInternalTransfer(
        params,
        params.tradingAccountFrom,
        params.tradingAccountTo,
      );
      return ApiResponse(
        res,
        true,
        ResponseMessages.INTERNAL_TRANSFER_CREATE_SUCCESS,
        deposit,
      );
    } catch (error) {
      return next(error);
    }
  }


  async makeInternalTransfer(req, res, next) {
    try {
      const params = req.body;
      const deposit = await service.addApprovedInternalTransfer(params, req.tradingAccountFrom, req.tradingAccountTo);

      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, deposit);
    } catch (error) {
      return next(error);
    }
  }

  async getInternalTransfers(req, res, next) {
    try {
      const params = req.query;
      params.customerId = req.user._id;
      const rec = await service.getInternalTransfers(params);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  // credit functions
  async makeCredit(req, res, next) {
    try {
      const params = req.body;
      const deposit = await service.addApprovedCreditInOut(params, req.tradingAccount);

      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, deposit);
    } catch (error) {
      return next(error);
    }
  }

  async getCredits(req, res, next) {
    try {
      const rec = await service.getCredits(req.query);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getTransactions(req, res, next) {
    try {
      const params = req.query;
      params.customerId = req.user._id;
      let rec;
      switch (params.type) {
        case 'deposit':
          rec = await service.getTransactions(params, true, false, false);
          break;
        case 'withdraw':
          rec = await service.getTransactions(params, false, true, false);
          break;
        case 'internal_transfer':
          rec = await service.getTransactions(params, false, false, true);
          break;
        case 'ibAll':
          rec = await service.getTransactions(params, false, true, true);
          break;
        default:
          rec = await service.getTransactions(params, true, true, true);
      }
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new TransactionController();
