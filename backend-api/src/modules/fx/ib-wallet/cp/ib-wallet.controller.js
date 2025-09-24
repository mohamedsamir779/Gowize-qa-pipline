//
const allServices = require('src/modules/services');
const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');

const {
  walletService: service,
  walletTransferService,
} = allServices;

class IbWalletController {
  async getWalletDetails(req, res, next) {
    try {
      const query = {
        belongsTo: req.user._id,
        ...req.query,
      };
      const rec = await service.getWalletByCustomerId(query.belongsTo);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async transfer(req, res, next) {
    try {
      const rec = await walletTransferService.approvedIbTransfer({
        ...req.body,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new IbWalletController();
