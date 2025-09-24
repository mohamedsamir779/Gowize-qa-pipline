//

/* eslint-disable class-methods-use-this */
const { ResponseMessages } = require('src/common/data');
const { ApiResponse, addAgentForUserList } = require('src/common/handlers');
const {
  usersService: service,
  customerService,
} = require('src/modules/services');
const mongoose = require('mongoose');

class UserController {
  async createRecord(req, res, next) {
    try {
      const rec = await service.createUser({
        ...req.body,
        email: req.body.email.toLowerCase(),
        createdBy: req.user._id,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const { id } = req.params;
      const rec = await service.updatePassword({
        ...req.body,
        id,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async userResetPassword(req, res, next) {
    try {
      const { id } = req.params;
      const rec = await service.resetPassword({
        ...req.body,
        id,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async updateRecordById(req, res, next) {
    try {
      const { id } = req.params;
      const updatedBy = req.user && req.user._id;
      const rec = await service.updateById(id, req.body, updatedBy);
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async deleteRecordById(req, res, next) {
    try {
      const { id } = req.params;
      const deletedBy = req.user && req.user._id;
      const customers = await customerService.find({
        agent: mongoose.Types.ObjectId(id),
      });
      if (customers.length > 0) {
        throw new Error('Agent has customers assigned to him/her. Please reassign them before deleting the agent.');
      }
      const rec = await service.deleteById(id, deletedBy);
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

  async getPaginate(req, res, next) {
    try {
      const rec = await service.findWithPagination({
        ...req.query,
      }, {
        populate: [{
          path: 'roleId',
          select: 'title key permissions.users.canBeAssigned',
        },
        {
          path: 'targetId',
          select: 'fx crypto accounts ibAccounts',
        }],
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getTeamManagers(req, res, next) {
    try {
      const rec = await service.findPossibleTeamManagers({
        ...req.query,
      }, {
        populate: [{
          path: 'roleId',
          select: 'title key',
        }],
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getTeamMembers(req, res, next) {
    try {
      const rec = await service.findTeamMembers({
        ...req.query,
      }, {
        populate: [{
          path: 'roleId',
          select: 'title key',
        }],
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getAssignable(req, res, next) {
    try {
      const query = addAgentForUserList(req.user, req.query);
      const rec = await service.getAssignableUsers({
        ...query,
      }, {
        populate: [{
          path: 'roleId',
          select: 'title key',
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
        path: 'roleId',
        select: 'title key',
      }]);
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

  async assignAgents(req, res, next) {
    try {
      const rec = await customerService.assignAgents(req.body, req.user._id);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { password } = req.body;
      const { _id } = req.user;
      const rec = await service.changePassword(_id, password);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      const rec = await service.forgotPassword(email);
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async checkEmailExists(req, res, next) {
    try {
      const email = req.query.email ? req.query.email.toLowerCase() : req.query.email;
      const rec = await service.checkEmail(email);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async disableTwoFactorAuth(req, res, next) {
    const { userId } = req.body;
    const disabledBy = req.user._id;
    try {
      const verified = await service.disableTwoFactorAuth(userId, disabledBy);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, verified);
    } catch (err) {
      return next(err);
    }
  }

  async updateUserSettings(req, res, next) {
    const id = req.user._id;
    const currentToken = req.token;
    try {
      const updated = await service.updateUserSettings(
        id,
        id,
        req.body?.settings || {},
        currentToken,
      );
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, updated);
    } catch (err) {
      return next(err);
    }
  }

  async updateEmailConfig(req, res, next) {
    try {
      const EmailConfig = await service.updateEmailConfig(req.body);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, EmailConfig);
    } catch (error) {
      return next(error);
    }
  }

  async activateEmailConfig(req, res, next) {
    try {
      const EmailConfig = await service.activateEmailConfig(req.body);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, EmailConfig);
    } catch (error) {
      return next(error);
    }
  }

  async testEmailConfig(req, res, next) {
    try {
      const EmailConfig = await service.testEmailConfig(req.body);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, EmailConfig);
    } catch (error) {
      return next(error);
    }
  }

  async sendEmail(req, res, next) {
    try {
      const resp = await service.sendEmail(req.body, req.user._id);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, resp);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new UserController();
