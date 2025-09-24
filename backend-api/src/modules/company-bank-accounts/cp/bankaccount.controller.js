//
const allServices = require('src/modules/services');
const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');

const { companyBankAccountService: service } = allServices;

class BankAccountController {
  async getBankAccounts(req, res, next) {
    try {
      const rec = await service.findWithPagination();
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new BankAccountController();
