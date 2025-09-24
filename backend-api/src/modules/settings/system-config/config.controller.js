//
const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');
const systemEmailConfigService = require('../settings.service');

class SystemEmailConfigController {
  async getSystemEmailConfig(req, res, next) {
    try {
      const systemEmailConfig = await systemEmailConfigService.getEmailConfig();
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, systemEmailConfig);
    } catch (error) {
      return next(res, error);
    }
  }

  async updateSystemEmailConfig(req, res, next) {
    try {
      const systemEmailConfig = await systemEmailConfigService.updateEmailConfig(req.body);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, systemEmailConfig);
    } catch (error) {
      return next(error);
    }
  }

  async activateSystemEmailConfig(req, res, next) {
    try {
      const systemEmailConfig = await systemEmailConfigService.activateEmailConfig(req.body);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, systemEmailConfig);
    } catch (error) {
      return next(error);
    }
  }

  async testSystemEmailConfig(req, res, next) {
    try {
      const systemEmailConfig = await systemEmailConfigService.testEmailConfig(req.body);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, systemEmailConfig);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new SystemEmailConfigController();
