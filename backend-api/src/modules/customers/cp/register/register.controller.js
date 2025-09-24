//
const { ResponseMessages, CONSTANTS } = require('src/common/data');
const { ApiResponse, encryptPassword, generateRandomPin } = require('src/common/handlers');

const {
  customerService: service,
  activityService,
  walletService,
  dWalletService: dwalletService,
  requestsService,
  customerPinService,
  systemEmailService,
  userService,
} = require('src/modules/services');
const { EMAIL_ACTIONS } = require('src/common/data/constants');
const utmCampaignService = require('../../../utm-campaigns/utm-campaign.service');

const {
  CUSTOMER_CATEGORIES,
  CUSTOMER_SUB_TYPES,
  CUSTOMER_SOURCES,
  CUSTOMER_TYPES,
} = CONSTANTS;

const {
  FOREX,
  CRYPTO,
  GOLD,
  MM,
} = CUSTOMER_CATEGORIES;

const {
  DEMO,
  LIVE,
  IB,
} = CUSTOMER_SUB_TYPES;

const {
  INDIVIDUAL,
  CORPORATE,
} = CUSTOMER_TYPES;

class RegisterController {
  async registerCryptoDemo(req, res, next) {
    const ip = req.headers['x-real-ip'];
    try {
      // const oldPass = req.body.password;
      let params = {
        ...req.body,
        ...req.addedParams,
        ip,
        password: encryptPassword(req.body.password),
        source: CONSTANTS.CUSTOMER_SOURCES.CRYPTO_DEMO,
        customerType: INDIVIDUAL,
        isLead: true,
      };
      let utmCampaign;
      if (params.utmCampaign) {
        utmCampaign = await utmCampaignService.findOne({ campaginToken: params.utmCampaign });
        if (utmCampaign) params.source = utmCampaign.source;
      }
      if (params.ref) {
        const user = await userService.findOne({ recordId: params.ref });
        if (user) { params.agent = user._id; }
      }
      params = await service.checkCustomerSettings(
        params,
        CRYPTO,
        INDIVIDUAL,
        DEMO,
      );
      const customer = await service.create(params);
      const user = await service.login(req.body.email, req.body.password, req.ip);
      await dwalletService.generateSystemWallets({
        customerId: customer._id,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, user);
    } catch (error) {
      return next(error);
    }
  }

  async registerCryptoLive(req, res, next) {
    const ip = req.headers['x-real-ip'];
    try {
      let params = {
        ...req.body,
        ...req.addedParams,
        ip,
        password: encryptPassword(req.body.password),
        source: CONSTANTS.CUSTOMER_SOURCES.CRYPTO_LIVE,
        category: CONSTANTS.CUSTOMER_CATEGORIES.CRYPTO,
        customerType: CONSTANTS.CUSTOMER_TYPES.INDIVIDUAL,
        crypto: {
          isDemo: false,
          isClient: true,
        },
      };
      let utmCampaign;
      if (params.utmCampaign) {
        utmCampaign = await utmCampaignService.findOne({ campaginToken: params.utmCampaign });
        if (utmCampaign) params.source = utmCampaign.source;
      }
      if (params.ref) {
        const user = await userService.findOne({ recordId: params.ref });
        if (user) { params.agent = user._id; }
      }
      params = await service.checkCustomerSettings(
        params,
        CRYPTO,
        INDIVIDUAL,
        LIVE,
      );
      const customer = await service.create(params);
      await walletService.generateSystemWallets({
        customerId: customer._id,
      });
      const user = await service.login(req.body.email, req.body.password, req.ip);
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, user);
    } catch (error) {
      return next(error);
    }
  }

  async registerCryptoCorporate(req, res, next) {
    try {
      const ip = req.headers['x-real-ip'];
      if (req.body.emailPin) {
        const emailPinActive = await customerPinService.verifyEmailPin(req.body.emailPin);
        if (!emailPinActive) { throw new Error('Email Pin is not correct'); }
      }
      let params = {
        ...req.body,
        ip,
        password: encryptPassword(req.body.password),
        source: CONSTANTS.CUSTOMER_SOURCES.CRYPTO_LIVE,
        customerType: CONSTANTS.CUSTOMER_TYPES.CORPORATE,
      };
      let utmCampaign;
      if (params.utmCampaign) {
        utmCampaign = await utmCampaignService.findOne({ campaginToken: params.utmCampaign });
        if (utmCampaign) params.source = utmCampaign.source;
      }
      if (params.ref) {
        const user = await userService.findOne({ recordId: params.ref });
        if (user) { params.agent = user._id; }
      }
      params = await service.checkCustomerSettings(
        params,
        CRYPTO,
        CORPORATE,
        LIVE,
      );
      const customer = await service.create(params);
      await walletService.generateSystemWallets({
        customerId: customer._id,
      });
      const user = await service.login(req.body.email, req.body.password, req.ip);
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, user);
    } catch (error) {
      return next(error);
    }
  }

  async registerFxDemo(req, res, next) {
    try {
      const ip = req.headers['x-real-ip'];

      // const oldPass = req.body.password;
      let params = {
        ...req.body,
        ...req.addedParams,
        ip,
        password: encryptPassword(req.body.password),
        source: CONSTANTS.CUSTOMER_SOURCES.FOREX_DEMO,
        customerType: CONSTANTS.CUSTOMER_TYPES.INDIVIDUAL,
        isLead: true,
      };
      let utmCampagin;
      if (params['utm-campaign']) {
        utmCampagin = utmCampaignService.findOne({ campaginToken: params['utm-campaign'] });
        if (utmCampagin) params.source = utmCampagin.source;
      }
      if (params.ref) {
        const user = userService.findOne({ recordId: params.ref });
        if (user) { params.agent = user._id; }
      }
      params = await service.checkCustomerSettings(
        params,
        FOREX,
        INDIVIDUAL,
        DEMO,
      );
      const customer = await service.create(params);
      const user = await service.login(req.body.email, req.body.password, req.ip);
      await dwalletService.generateSystemWallets({
        customerId: customer._id,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, user);
    } catch (error) {
      return next(error);
    }
  }

  async registerFxLive(req, res, next) {
    try {
      const ip = req.headers['x-real-ip'];
      let params = {
        ...req.body,
        ...req.addedParams,
        ip,
        password: encryptPassword(req.body.password),
        source: CONSTANTS.CUSTOMER_SOURCES.FOREX_LIVE,
        customerType: CONSTANTS.CUSTOMER_TYPES.INDIVIDUAL,
      };
      let utmCampaign;
      if (params.utmCampaign) {
        utmCampaign = await utmCampaignService.findOne({ campaginToken: params.utmCampaign });
        if (utmCampaign) params.source = utmCampaign.source;
      }
      if (params.ref) {
        const user = await userService.findOne({ recordId: params.ref });
        if (user) { params.agent = user._id; }
      }
      params = await service.checkCustomerSettings(
        params,
        FOREX,
        INDIVIDUAL,
        LIVE,
      );
      const customer = await service.create(params);
      await walletService.generateSystemWallets({
        customerId: customer._id,
      });
      systemEmailService.sendSystemEmail(EMAIL_ACTIONS.REGISTER_INDIVIDUAL, {
        to: params.email,
        ...params,
        password: req.body.password,
        lang: customer?.language,
      });
      const user = await service.login(req.body.email, req.body.password, req.ip);
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, user);
    } catch (error) {
      return next(error);
    }
  }

  async registerFxIb(req, res, next) {
    try {
      const ip = req.headers['x-real-ip'];
      let params = {
        ...req.body,
        ...req.addedParams,
        ip,
        password: encryptPassword(req.body.password),
        source: CONSTANTS.CUSTOMER_SOURCES.FOREX_IB,
        customerType: CONSTANTS.CUSTOMER_TYPES.INDIVIDUAL,
      };
      let utmCampaign;
      if (params.utmCampaign) {
        utmCampaign = await utmCampaignService.findOne({ campaginToken: params.utmCampaign });
        if (utmCampaign) params.source = utmCampaign.source;
      }
      if (params.ref) {
        const user = await userService.findOne({ recordId: params.ref });
        if (user) { params.agent = user._id; }
      }
      params = await service.checkCustomerSettings(
        params,
        FOREX,
        INDIVIDUAL,
        IB,
      );
      const customer = await service.create(params);
      await requestsService.createIbRequest(customer._id);
      await walletService.generateSystemWallets({
        customerId: customer._id,
      });
      const user = await service.login(req.body.email, req.body.password, req.ip);
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, user);
    } catch (error) {
      return next(error);
    }
  }

  async registerSp(req, res, next) {
    try {
      const ip = req.headers['x-real-ip'];
      let params = {
        ...req.body,
        ...req.addedParams,
        ip,
        password: encryptPassword(req.body.password),
        source: CONSTANTS.CUSTOMER_SOURCES.SP_LIVE,
        customerType: CONSTANTS.CUSTOMER_TYPES.INDIVIDUAL,
      };
      params = await service.checkCustomerSettings(
        params,
        FOREX,
        INDIVIDUAL,
        SP,
      );
      const customer = await service.create(params);
      await walletService.generateSystemWallets({
        customerId: customer._id,
      });
      const user = await service.login(req.body.email, req.body.password, req.ip);
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, user);
    } catch (error) {
      return next(error);
    }
  }

  async registerInvestor(req, res, next) {
    try {
      const ip = req.headers['x-real-ip'];
      let params = {
        ...req.body,
        ...req.addedParams,
        ip,
        password: encryptPassword(req.body.password),
        source: CONSTANTS.CUSTOMER_SOURCES.INVESTOR_LIVE,
        customerType: CONSTANTS.CUSTOMER_TYPES.INDIVIDUAL,
      };
      params = await service.checkCustomerSettings(
        params,
        FOREX,
        INDIVIDUAL,
        INVESTOR,
      );
      const customer = await service.create(params);
      await walletService.generateSystemWallets({
        customerId: customer._id,
      });
      const user = await service.login(req.body.email, req.body.password, req.ip);
      // requestsService.createInvestorRequest(
      //   {
      //     customerId: customer._id,
      //     userId: null,
      //   }, {
      //     spRef: req.body.spRef || null,
      //   },
      // );
      await service.updateInvestorProfile({
        customer: {
          _id: customer._id,
        },
        becomeInvestor: true,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, user);
    } catch (error) {
      return next(error);
    }
  }

  async registerFxCorporate(req, res, next) {
    try {
      const ip = req.headers['x-real-ip'];
      let params = {
        ...req.body,
        ip,
        password: encryptPassword(req.body.password),
        source: CONSTANTS.CUSTOMER_SOURCES.FOREX_LIVE,
        customerType: CONSTANTS.CUSTOMER_TYPES.CORPORATE,
      };
      params = await service.checkCustomerSettings(
        params,
        FOREX,
        CORPORATE,
        LIVE,
      );
      const customer = await service.create(params);
      await walletService.generateSystemWallets({
        customerId: customer._id,
      });
      const user = await service.login(req.body.email, req.body.password, req.ip);
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, user);
    } catch (error) {
      return next(error);
    }
  }

  async registerFxCorporateIb(req, res, next) {
    try {
      const ip = req.headers['x-real-ip'];
      let params = {
        ...req.body,
        ip,
        password: encryptPassword(req.body.password),
        category: CONSTANTS.CUSTOMER_CATEGORIES.FOREX,
        customerType: CONSTANTS.CUSTOMER_TYPES.CORPORATE,
      };
      params = await service.checkCustomerSettings(
        params,
        FOREX,
        CORPORATE,
        IB,
      );
      const customer = await service.create(params);
      await requestsService.createIbRequest(customer._id);
      await walletService.generateSystemWallets({
        customerId: customer._id,
      });
      const user = await service.login(req.body.email, req.body.password, req.ip);
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, user);
    } catch (error) {
      return next(error);
    }
  }

  async createRegisterPin(req, res, next) {
    try {
      const email = req.body.email.toLowerCase();
      const customer = await service.findOne({ email });
      if (customer) {
        throw new Error('User already registered');
      }
      await customerPinService.persistPin(email, { email, value: generateRandomPin(6), phone: '' }, customer);
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS);
    } catch (error) {
      return next(error);
    }
  }

  async verifyRegisterPin(req, res, next) {
    try {
      const { emailPin } = req.body;
      const email = req.body.email.toLowerCase();
      const verified = await customerPinService.verifyEmailPin(email, emailPin);
      if (!verified) throw new Error('Pin is not correct');
      return ApiResponse(res, true, true);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new RegisterController();
