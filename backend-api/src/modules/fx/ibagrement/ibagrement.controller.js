//
/* eslint-disable class-methods-use-this */
const { ResponseMessages, CONSTANTS } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');
const {
  customerService, settingService,
} = require('src/modules/services');

const service = require('./ibagrement.service');

const products = CONSTANTS.FOREX_SUPPORTED_PRODUCTS;

const validateSharedStructureLimit = async (totals, members) => {
  const settings = await settingService.findOne({});
  const ibLevelLimit = settings.limitations.ibagrementlevel;
  if (parseFloat(members[members.length - 1].level) - 1 >= ibLevelLimit) {
    return false;
  }
  return true;
};

class TransactionController {
  async createMasterAgrement(req, res, next) {
    try {
      const params = req.body;
      const deposit = await service.createMasterAgrement(
        req.customer,
        params.title,
        params.values,
        req.user._id,
      );

      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, deposit);
    } catch (error) {
      return next(error);
    }
  }

  async createSharedAgrement(req, res, next) {
    try {
      const params = req.body;
      if (!validateSharedStructureLimit(params.totals, params.members)) {
        return ApiResponse(res, true, {
          ...ResponseMessages.RECORD_CREATE_FAIL,
          message: 'Invalid values passed',
        }, null);
      }
      const customers = await customerService.find({
        _id: {
          $in: params.members.map((obj) => obj.customerId),
        },
      }, '_id fx');
      const deposit = await service.createSharedAgrement(
        customers,
        params.title,
        params.totals,
        params.members,
        req.user._id,
      );

      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, deposit);
    } catch (error) {
      return next(error);
    }
  }

  async getAgrements(req, res, next) {
    try {
      const { customerId } = req.query;
      const agrements = await service.getInvolvedAgreements(customerId);

      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, agrements);
    } catch (error) {
      return next(error);
    }
  }

  async updateMasterAgreement(req, res, next) {
    try {
      const { title, values, customerId } = req.body;
      const agreement = await service.updateMasterAgrement(
        req.params.id,
        title,
        values,
        customerId,
        req.user._id,
      );
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, agreement);
    } catch (error) {
      return next(error);
    }
  }

  async updateSharedAgreement(req, res, next) {
    try {
      const { title, totals, members } = req.body;
      const agreement = await service.updateSharedAgrement(
        req.params.id,
        title,
        totals,
        members,
        req.user._id,
      );
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, agreement);
    } catch (error) {
      return next(error);
    }
  }

  async getFxProducts(req, res, next) {
    try {
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, products);
    } catch (error) {
      return next(error);
    }
  }

  async deleteAgreement(req, res, next) {
    try {
      const rec = await service.deleteAgreement(req.params.id, req.user._id);
      return ApiResponse(res, true, ResponseMessages.RECORD_DELETE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new TransactionController();
