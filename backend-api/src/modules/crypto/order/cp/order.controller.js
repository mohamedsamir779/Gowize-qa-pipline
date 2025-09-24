//
const allServices = require('src/modules/services');
const { ResponseMessages, CONSTANTS } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');

const { orderService: service, dOrderService: dservice } = allServices;

class OrderController {
  async createOrder(req, res, next) {
    try {
      const params = req.body;
      const query = {
        customerId: (req.user && req.user._id) || '',
        ...params,
      };
      const response = req.user && !req.user.isLead
        ? await service.createOrder(query)
        : await dservice.createOrder(query);
      const message = response && response.status === 'rejected' ? 'Order Could not be completed' : 'Order Created Successfully';
      return ApiResponse(res, true, message, response);
    } catch (error) {
      return next(error);
    }
  }

  async getRecords(req, res, next) {
    try {
      const rec = req.user && !req.user.isLead
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
        customerId: (req.user && req.user._id) || '',
      };
      const rec = req.user && !req.user.isLead
        ? await service.newFindWithPagination(query)
        : await dservice.newFindWithPagination(query);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getRecordById(req, res, next) {
    try {
      const rec = req.user && !req.user.isLead
        ? await service.findById(req.params.id)
        : await dservice.findById(req.params.id);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async cancelOrder(req, res, next) {
    try {
      const rec = req.user && !req.user.isLead
        ? await service.cancelOrder(req.params.id)
        : await dservice.cancelOrder(req.params.id);
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new OrderController();
