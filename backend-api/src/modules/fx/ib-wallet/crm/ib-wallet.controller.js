//
const allServices = require('src/modules/services');
const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');

const {
  walletService: service,
} = allServices;

class WalletController {
  async generateWalletForCustomerId(req, res, next) {
    try {
      const {
        id: customerId,
      } = req.params;
      const wallet = await service.getWalletByCustomerId(customerId);
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, wallet);
    } catch (error) {
      return next(error);
    }
  }

  async getRecordByCustomerId(req, res, next) {
    try {
      const {
        id: customerId,
      } = req.params;
      const wallet = await service.createIbWallet({
        customerId,
        createdBy: req.user._id,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, wallet);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new WalletController();
