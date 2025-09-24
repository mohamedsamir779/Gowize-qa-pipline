const { ResponseMessages } = require('src/common/data');
const { ApiResponse, addAgentToQuery } = require('src/common/handlers');

const service = require('../transfer.service');

class WalletTransferController {
  async getTransactions(req, res, next) {
    try {
      let { query } = req;
      query = addAgentToQuery(req.user, query);
      const rec = await service.getAllTransactions(query);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async approveTransaction(req, res, next) {
    try {
      const { id } = req.params;
      const { _id: userId } = req.user;
      const rec = await service.approveTransaction(id, userId);
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async rejectTransaction(req, res, next) {
    try {
      const { id } = req.params;
      const { _id: userId } = req.user;
      const rec = await service.rejectTransaction(id, userId);
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async addApprovedTransaction(req, res, next) {
    try {
      const { _id: userId } = req.user;
      const rec = await service.addApprovedTransaction({
        ...req.body,
        userId,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new WalletTransferController();
