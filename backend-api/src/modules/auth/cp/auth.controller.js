/* eslint-disable class-methods-use-this */
const { ResponseMessages } = require('src/common/data');
const { ApiResponse, getCustomerCategory } = require('src/common/handlers');

const service = require('src/modules/services').customerService;
const {
  usersService
} = require('src/modules/services');
const { customerDefaultPortal } = require('../../../common/data/keys');

class AuthController {
  async login(req, res, next) {
    const { email, password } = req.body;
    try {
      const ip = req.headers['x-real-ip'];
      const user = await service.login(email, password, ip);
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
      const user = await service.findById(_id, {}, true, [{
        path: 'markupId',
        select: 'value title markets isPercentage',
      }, {
        path: 'transactionFeeId',
        select: 'value assets title isPercentage minValue maxValue',
      }, {
        path: 'tradingFeeId',
        select: 'value markets title isPercentage minValue maxValue',
      }]);
      if (!user) {
        return ApiResponse(res, false, ResponseMessages.ACCESS_DENIED, {});
      }
      const category = getCustomerCategory(user);
      if (category) {
        user.category = category;
      }
      if (!user.defaultPortal) {
        user.defaultPortal = customerDefaultPortal;
      }
      if (user.agent) {
        const manager = await usersService.findById(user.agent);
        user.manager = {
          name: `${manager.firstName} ${manager.lastName}`,
          email: manager.email,
          createdAt: manager.createdAt,
          phone: manager.phone,
        };
      }
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, user);
    } catch (error) {
      return next(error);
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

  async disableTwoFactorAuth(req, res, next) {
    const { token, email } = req.body;
    try {
      const verified = await service.verifyTwoFactorAuth({ token, email });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, verified);
    } catch (err) {
      return next(err);
    }
  }

  async firstTime2FAVerification(req, res, next) {
    const { token } = req.body;
    const { _id } = req.user;
    try {
      const verified = await service.firstTime2FAVerification({ token, id: _id });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, verified);
    } catch (err) {
      return next(err);
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
}

module.exports = new AuthController();
