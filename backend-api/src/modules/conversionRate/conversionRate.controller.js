//
const allServices = require('src/modules/services');
const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');

const { conversionRateService: service } = allServices;

class ConversionRateController {
  async getConversionRate(req, res, next) {
    try {
      const params = req.query;
      const response = await service.getConversionRate(params);
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, parseFloat(response));
    } catch (error) {
      return next(error);
    }
  }

  async getConversionRateValue(req, res, next) {
    try {
      const params = req.query;
      const response = await service.getConversionRateValue(params);
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, response);
    } catch (error) {
      return next(error);
    }
  }

  async getPaginate(req, res, next) {
    try {
      const params = req.query;
      const response = await service.getPaginate(params);
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, response);
    } catch (error) {
      return next(error);
    }
  }

  async create(req, res, next) {
    try {
      const params = req.body;
      const response = await service.createRecord(params);
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, response);
    } catch (error) {
      return next(error);
    }
  }

  async update(req, res, next) {
    try {
      const params = req.body;
      const { id } = req.params;
      const response = await service.update(id, params);
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, response);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new ConversionRateController();
