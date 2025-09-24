const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');
const service = require('../reports.service');

class WalletTransfer {
  async getPaginate(req, res, next) {
    try {
      const data = await service.getPaginate({
        customerId: req.user._id,
        ...req.query,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, data);
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new WalletTransfer();
