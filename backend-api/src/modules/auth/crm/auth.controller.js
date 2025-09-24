/* eslint-disable class-methods-use-this */
const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');
const {
  usersService: service,
} = require('src/modules/services');
const { keys } = require('../../../common/data');

class AuthController {
  async loginCrm(req, res, next) {
    const { email, password } = req.body;
    try {
      const user = await service.loginCrm(email, password);
      if (!user) {
        return ApiResponse(res, false, ResponseMessages.LOGIN_FAIL, {});
      }
      return ApiResponse(res, true, ResponseMessages.LOGIN_SUCCESS, user);
    } catch (error) {
      return next(error);
    }
  }

  async getProfile(req, res, next) {
    const { _id } = req.user;
    try {
      const user = await service.getUserById(_id);
      user.metaInfo = keys.uiVisibility;
      user.newDays = keys.newDays;
      if (!user) {
        return ApiResponse(res, false, ResponseMessages.ACCESS_DENIED, {});
      }
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, user);
    } catch (error) {
      return next(error);
    }
  }

  async generateQR(req, res, next) {
    try {
      const qrCodeData = await service.generateQRCode(req.user);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, qrCodeData);
    } catch (err) {
      return next(err);
    }
  }

  async verifyTwoFactorAuth(req, res, next) {
    try {
      const ip = req.headers['x-real-ip'];
      const verified = await service.verifyTwoFactorAuth({
        ...req.body,
        ip,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, verified);
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new AuthController();
