//
const allServices = require('src/modules/services');
const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');

const { usersService, rolesService: service } = allServices;

class RoleController {
  async createRecord(req, res, next) {
    try {
      const rec = await service.createNewRole({ ...req.body, createdBy: req.user._id });
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getPaginate(req, res, next) {
    try {
      const rec = await service.findWithPagination({ ...req.query }, {
        populate: [{
          path: 'createdBy',
          select: 'firstName lastName',
        }],
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async updateRecordById(req, res, next) {
    try {
      const { id } = req.params;
      const updatedBy = req.user && req.user._id;
      const rec = await service.updateById(id, req.body, true, updatedBy);
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async deleteRecordById(req, res, next) {
    try {
      const { id } = req.params;
      const deletedBy = req.user && req.user._id;
      const usersCount = await usersService.count({ roleId: id });
      if (usersCount > 0) {
        return next(new Error(`Error: Role currently assigned to ${usersCount} users`));
      }
      const rec = await service.deleteById(id, deletedBy);
      usersService.endAllSessionsByRole(id);
      return ApiResponse(res, true, ResponseMessages.RECORD_DELETE_SUCCESS, rec);
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

  async getRecordById(req, res, next) {
    try {
      const rec = await service.findById(req.params.id);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getRecordPaginated(req, res, next) {
    try {
      const rec = await service.find({});
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async updateRecordStatus(req, res, next) {
    try {
      const { id, status } = req.params;
      const rec = await service.updateById(id, { isActive: status === 'activate' });
      if (status === 'deactivate') {
        usersService.endAllSessionsByRole(id);
      }
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new RoleController();
