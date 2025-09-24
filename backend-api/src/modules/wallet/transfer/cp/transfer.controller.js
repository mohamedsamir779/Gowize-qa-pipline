const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');
const service = require('../transfer.service');

class WalletTransfer {
  async createWalletTransferRequest(req, res, next) {
    try {
      const { body: params } = req;
      params.customerId = req.user._id;
      const data = await service.addPendingTransaction(params);
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, data);
    } catch (err) {
      return next(err);
    }
  }

  async addApprovedTransaction(req, res, next) {
    try {
      const { body: params } = req;
      params.customerId = req.user._id;
      const rec = await service.addApprovedTransaction({
        ...params,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new WalletTransfer();
