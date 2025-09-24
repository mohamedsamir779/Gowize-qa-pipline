//
const allServices = require('src/modules/services');
const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');

const { transactionService: service, dTransactionService: dservice } = allServices;

class DepositController {
  async basicDeposit(req, res, next) {
    try {
      const query = {
        ...req.body,
        customerId: (req.user && req.user._id) || '',
      };
      const rec = req.user && !req.user.isLead
        ? await service.basicDeposit(query, req.file)
        : await dservice.basicDeposit(query);
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
      const rec = req.user && !req.user.isLead
        ? await service.getDeposits(query)
        : await dservice.getDeposits(query);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getGateways(req, res, next) {
    try {
      const rec = req.user && !req.user.isLead
        ? await service.getDepositGateways()
        : await dservice.getDepositGateways();
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new DepositController();
