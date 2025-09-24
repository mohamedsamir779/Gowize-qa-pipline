//
const allServices = require('src/modules/services');
const { ResponseMessages, CONSTANTS } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');
const { enableCrypto } = require('../../../../../common/data/keys');

const { transactionService: service, dTransactionService: dservice } = allServices;

class WithdrawController {
  async basicWithdraw(req, res, next) {
    try {
      const query = {
        ...req.body,
        customerId: (req.user && req.user._id) || '',
      };
      const rec = enableCrypto && (req.user && req.user.isLead)
        ? await dservice.basicWithdraw(query)
        : await service.basicWithdraw(query);
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async cryptoWithdraw(req, res, next) {
    try {
      const query = {
        ...req.body,
        customerId: (req.user && req.user._id) || '',
      };
      const rec = enableCrypto && (req.user && req.user.isLead)
        ? await dservice.addPendingBlockchainWithdraw(query)
        : await service.addPendingBlockchainWithdraw(query);
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getRecords(req, res, next) {
    try {
      const query = {
        ...req.body,
        ...req.query,
        customerId: (req.user && req.user._id) || '',
      };
      const rec = enableCrypto && (req.user && req.user.isLead)
        ? await dservice.getWithdraws(query)
        : await service.getWithdraws(query);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getGateways(req, res, next) {
    try {
      const rec = enableCrypto && (req.user && req.user.isLead)
        ? await dservice.getWithdrawalGateways()
        : await service.getWithdrawalGateways();
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new WithdrawController();
