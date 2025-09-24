//
const allServices = require('src/modules/services');
const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');

const { assetService: service } = allServices;

class AssetController {
  async createAsset(req, res, next) {
    try {
      const params = req.body;
      params.createdBy = req.user && req.user._id;
      const response = await service.createAsset(params, req.file);
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, response);
    } catch (error) {
      return next(error);
    }
  }

  async updateAsset(req, res, next) {
    try {
      const { id } = req.params;
      const params = req.body;
      params.fee = JSON.parse(req.body.fee);
      params.minAmount = JSON.parse(req.body.minAmount);
      params.image = req.file && req.file.filename;
      params.createdBy = req.user && req.user._id;
      const response = await service.updateById(id, params);
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, {
        ...response,
        data: params,
      });
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

  async deleteRecordById(req, res, next) {
    try {
      const rec = await service.deleteById(req.params.id);
      return ApiResponse(res, true, ResponseMessages.RECORD_DELETE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new AssetController();
