//
const allServices = require('src/modules/services');
const { ResponseMessages, CONSTANTS } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');

const { logsService: service, dLogsService: dservice } = allServices;

class LogsController {
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
      const populate = {
        populate: [{
          path: 'customerId',
          select: 'firstName lastName email',
        }, {
          path: 'userId',
          select: 'firstName lastName email',
        }],
      };
      const rec = req.customer && req.customer.isLead
        ? await dservice.findWithPagination(req.query, populate)
        : await service.findWithPagination(req.query, populate);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getPaginateUsers(req, res, next) {
    try {
      const populate = {
        populate: [{
          path: 'userId',
          select: 'firstName lastName email',
        }],
      };
      const rec = await service.findWithPagination({
        ...req.query,
        type: { $ne: CONSTANTS.LOG_TYPES.SYSTEM_EMAIL },
      }, populate);
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
}

module.exports = new LogsController();
