//
const allServices = require('src/modules/services');
const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');

const { teamService: service } = allServices;

class TeamController {
  async createRecord(req, res, next) {
    try {
      const rec = await service.createTeam({ ...req.body, createdBy: req.user._id });
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async updateRecordById(req, res, next) {
    try {
      const { id } = req.params;
      await service.updateTeam(id, req.body, req.user._id);
      const rec = await service.findById(id, {}, true, [{
        path: 'managerId',
        select: 'firstName lastName email',
      }, {
        path: 'members',
        select: 'firstName lastName email',
      }]);
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async addTeamMember(req, res, next) {
    try {
      const { id } = req.params;
      const { members } = req.body;
      const createdBy = req.user && req.user._id;
      const out = await service.addTeamMember(id, members, createdBy);
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, out);
    } catch (error) {
      return next(error);
    }
  }

  async removeTeamMember(req, res, next) {
    try {
      const { id } = req.params;
      const { members } = req.body;
      const deletedBy = req.user && req.user._id;
      const out = await service.removeTeamMember(id, members, deletedBy);
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, out);
    } catch (error) {
      return next(error);
    }
  }

  async deleteRecordById(req, res, next) {
    try {
      const { id } = req.params;
      const rec = await service.deleteTeam(id);
      return ApiResponse(res, true, ResponseMessages.RECORD_DELETE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getPaginate(req, res, next) {
    try {
      const rec = await service.findWithPagination({
        ...req.query,
      }, {
        populate: [{
          path: 'managerId',
          select: 'firstName lastName email',
        }, {
          path: 'members',
          select: 'firstName lastName email',
        }],
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getRecordById(req, res, next) {
    try {
      const rec = await service.findById(req.params.id, {}, true, [{
        path: 'managerId',
        select: 'firstName lastName email',
      }, {
        path: 'members',
        select: 'firstName lastName email',
      }]);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async isCurrentUserManagerOfAssignedAgent(req, res, next) {
    try {
      const rec = await
      service.isCurrentUserManagerOfAssignedAgent(req.user._id, req.query.assignedAgentId);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new TeamController();
