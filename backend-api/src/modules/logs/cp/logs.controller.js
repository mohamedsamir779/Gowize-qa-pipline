//
const allServices = require('src/modules/services');
const { ResponseMessages, CONSTANTS } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');

const { logsService: service, dLogsService: dservice } = allServices;

class LogsController {
  async getClientLogs(req, res, next) {
    try {
      const query = {
        customerId: req.user && req.user._id,
        ...req.query,
        userLog: false,
        level: 1,
      };
      const rec = req.user && !req.user.isLead
        ? await service.findWithPagination(query)
        : await dservice.findWithPagination(query);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new LogsController();
