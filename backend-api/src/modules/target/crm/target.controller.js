const allServices = require('src/modules/services');
const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');

const { targetService: service, userService } = allServices;

class TargetController {
  async getRecords(req, res, next) {
    try {
      const rec = await service.getTargets(
        req.user._id,
        req.user.roleId.permissions.targets.getAll,
      );
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getCanBeAssignedUsers(req, res, next) {
    try {
      const rec = await service.getCanBeAssignedUsers(req.user._id);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async updateRecordById(req, res, next) {
    const { userId } = req.body;
    try {
      const rec = await service.createOrUpdate({ userId }, req.body);
      await userService.updateById(req.body.userId, { targetId: rec._id });
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async updateBulk(req, res, next) {
    try {
      const { targets } = req.body;
      const rec = await service.bulkUpdate(targets);
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new TargetController();
