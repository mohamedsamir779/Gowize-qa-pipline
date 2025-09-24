//
const allServices = require('src/modules/services');
const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');

const { bankAccountService: service } = allServices;

class BankAccountController {
  async checkAccess(req, res, next) {
    try {
      const { id } = req.params;
      const rec = await service.findById(id);
      if (!rec || rec.customerId.toString() !== req.user._id) {
        return next(new CustomError({
          ...ResponseMessages.ACCESS_DENIED,
          type: 'AUTH',
        }));
      }
      return next();
    } catch (error) {
      return next(error);
    }
  }

  async addBankAccount(req, res, next) {
    try {
      const params = req.body;
      const rec = await service.addBankAccount({
        ...params,
        customerId: req.user._id,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getMyBankAccounts(req, res, next) {
    try {
      const rec = await service.findWithPagination({
        customerId: req.user._id,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async deleteRecordById(req, res, next) {
    try {
      const rec = await service.deleteBankAccount(req.params.id, { customerId: req.user._id });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async updateRecordById(req, res, next) {
    try {
      const rec = await service.editBankAccount(req.params.id, {
        ...req.body,
        customerId: req.user._id,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new BankAccountController();
