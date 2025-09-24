//
const allServices = require('src/modules/services');
const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');

const { marketService: service } = allServices;

class MarketController {
  async createMarket(req, res, next) {
    try {
      const params = req.body;
      params.createdBy = req.user && req.user._id;
      const response = await service.createMarket(params);
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, response);
    } catch (error) {
      return next(error);
    }
  }

  async updateMarket(req, res, next) {
    try {
      const params = req.body;
      params.updatedBy = req.user && req.user._id;
      const response = await service.update(params);
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, response);
    } catch (error) {
      return next(error);
    }
  }

  async getRecords(req, res, next) {
    try {
      const rec = await service.find();
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getPaginate(req, res, next) {
    try {
      const rec = await service.findWithPagination({
        ...req.query,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getRecordById(req, res, next) {
    try {
      const rec = await service.findById(req.params.id);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async updateRecordStatus(req, res, next) {
    try {
      const { id, status } = req.params;
      const rec = await service.updateStatus(id, { active: status === 'activate' });
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new MarketController();
