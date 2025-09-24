//
const allServices = require('src/modules/services');
const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');

const { orderService: service } = allServices;

class OrderController {
  async createOrder(req, res, next) {
    try {
      const params = req.body;
      const response = await service.createOrder({
        userId: (req.user && req.user._id) || '',
        customerId: (params.customerId) || '',
        ...params,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, response);
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
      const { customerId } = req.query;
      const rec = await service.findWithPagination({
        ...req.query,
        customerId,
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

  async cancelOrder(req, res, next) {
    try {
      const rec = await service.cancelOrder(req.params.id);
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new OrderController();
