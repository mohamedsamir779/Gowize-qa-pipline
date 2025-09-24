//
const allServices = require('src/modules/services');
const { ResponseMessages, CONSTANTS } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');

const {
  dConvertService: dservice,
  convertService: service,
} = allServices;

class ConvertController {
  async createConvert(req, res, next) {
    try {
      const params = req.body;
      const query = {
        ...params,
        userId: (req.user && req.user._id) || '',
      };
      const response = req.customer && !req.user.isLead
        ? await service.convert(query)
        : await dservice.convert(query);
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, response);
    } catch (error) {
      return next(error);
    }
  }

  async getRecords(req, res, next) {
    try {
      const rec = req.customer && !req.user.isLead
        ? await service.find()
        : await dservice.find();
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getPaginate(req, res, next) {
    try {
      const query = {
        ...req.query,
      };
      const populate = {
        populate: [{
          path: 'fromAssetId',
          select: 'symbol image isCrypto',
        }, {
          path: 'toAssetId',
          select: 'symbol image isCrypto',
        },
        {
          path: 'customerId',
          select: '_id firstName lastName',
        }],
      };
      const rec = req.customer && !req.user.isLead
        ? await service.findWithPagination(query, populate)
        : await dservice.findWithPagination(query, populate);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getAllPaginate(req, res, next) {
    try {
      const query = {
        ...req.query,
      };
      const populate = {
        populate: [{
          path: 'fromAssetId',
          select: 'symbol image isCrypto',
        }, {
          path: 'toAssetId',
          select: 'symbol image isCrypto',
        }, {
          path: 'customerId',
          select: '_id firstName lastName',
        }],
      };
      const rec = await service.findWithPagination(query, populate);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getRecordById(req, res, next) {
    try {
      const rec = req.customer && !req.user.isLead
        ? await service.findById(req.params.id)
        : await dservice.findById(req.params.id);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async previewConvert(req, res, next) {
    try {
      const query = {
        ...req.query,
      };
      const response = req.customer && !req.user.isLead
        ? await service.previewConversion(query)
        : await dservice.previewConversion(query);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, response);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new ConvertController();
