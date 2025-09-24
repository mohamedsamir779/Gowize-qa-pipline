//
const allServices = require('src/modules/services');
const { ResponseMessages, CONSTANTS } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');

const {
  dWalletService: dservice,
  walletService: service,
  transactionService
} = allServices;

class WalletsController {
  async getPaginate(req, res, next) {
    try {
      const query = {
        belongsTo: req.user._id,
        ...req.query,
      };
      const rec = await service.getCPWalletdata(query);
      // const rec = req.user && !req.customer.isLead
      //   ? await service.getCPWalletdata(query)
      //   : await dservice.getCPWalletdata(query);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new WalletsController();
