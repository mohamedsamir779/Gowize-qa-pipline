/* eslint-disable class-methods-use-this */
const { ResponseMessages, CONSTANTS } = require('src/common/data');
const {
  ApiResponse, encryptPassword, addAgentToQuery, generatePassword, decryptPassword,
} = require('src/common/handlers');

const {
  customerService: service,
  systemEmailService,
  walletService,
  dWalletService: dwalletService,
  accountService,
  ibAgrementService,
} = require('src/modules/services');
const { Types } = require('mongoose');

const { EMAIL_ACTIONS } = require('../../../../common/data/constants');
const requestService = require('../../../requests/request.service');
const {
  clientName,
  privacyPolicyLink,
  clientAgreementLink,
  companyWebsite,
} = require('../../../../common/data/keys');

const {
  CUSTOMER_CATEGORIES,
  CUSTOMER_SUB_TYPES,
  CUSTOMER_TYPES,
} = CONSTANTS;

const {
  FOREX,
  CRYPTO,
  GOLD,
  MM,
} = CUSTOMER_CATEGORIES;

const {
  INDIVIDUAL,
  CORPORATE,
} = CUSTOMER_TYPES;

const {
  DEMO,
  LIVE,
  IB,
  SP,
  INVESTOR,
} = CUSTOMER_SUB_TYPES;

const defaultDeclaration = [`By clicking here I give my consent for ${clientName} to contact me for marketing purposes. You can opt out at any time. For further details please see our Marketing and Communication Policy Statement.`,
  `You have read, understood, and agreed to ${clientName}'s client agreement which includes order execution policy, conflict of interest policy, <a href=${privacyPolicyLink} target='_blank'>privacy policy</a>, 3rd party disclosure policy and any other terms in the <a href=${clientAgreementLink} target='_blank'>client agreement</a>.`,
  `You confirm that you do not breach any regulation of your country of residence in trading with ${clientName}.`,
  'Your electronic signature is considered a legal and official signature'];
const defaultPassword = '123456';

class CustomerController {
  async createClient(req, res, next) {
    try {
      const password = req.body.password ? encryptPassword(req.body.password) : encryptPassword('123456');
      const params = {
        ...req.body,
        email: req.body.email.toLowerCase(),
        ip: req.ip,
        createdBy: req.user._id,
        category: CONSTANTS.CUSTOMER_CATEGORIES.CRYPTO,
        source: CONSTANTS.CUSTOMER_SOURCES.CRM,
        isLead: false,
        password,
        declarations: [`By clicking here I give my consent for ${clientName} to contact me for marketing purposes. You can opt out at any time. For further details please see our Marketing and Communication Policy Statement.`,
          `You have read, understood, and agreed to ${clientName}'s client agreement which includes order execution policy, conflict of interest policy, <a href=${privacyPolicyLink} target='_blank'>privacy policy</a>, 3rd party disclosure policy and any other terms in the <a href=${clientAgreementLink} target='_blank'>client agreement</a>.`,
          `You confirm that you do not breach any regulation of your country of residence in trading with ${clientName}.`,
          'Your electronic signature is considered a legal and official signature'],
      };
      const rec = await service.create(params);
      if (!params.isLead) {
        walletService.generateSystemWallets({
          customerId: rec._id,
        });
      } else {
        dwalletService.generateSystemWallets({
          customerId: rec._id,
        });
      }
      if (params.sendWelcomeEmail) {
        systemEmailService.sendSystemEmail(EMAIL_ACTIONS.REGISTER_INDIVIDUAL, {
          to: params.email,
          ...params,
          lang: rec?.language,
          password,
        });
      }
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async createFxRecord(req, res, next) {
    try {
      const ip = req.headers['x-real-ip'];
      const pass = req.body.password ? req.body.password : generatePassword(12);
      let params = {
        ...req.body,
        email: req.body.email.toLowerCase(),
        ip,
        createdBy: req.user._id,
        category: CONSTANTS.CUSTOMER_CATEGORIES.FOREX,
        source: CONSTANTS.CUSTOMER_SOURCES.CRM,
        isLead: false,
        password: req.body.password ? encryptPassword(req.body.password) : encryptPassword(pass),
        declarations: [`By clicking here I give my consent for ${clientName} to contact me for marketing purposes. You can opt out at any time. For further details please see our Marketing and Communication Policy Statement.`,
          `You have read, understood, and agreed to ${clientName}'s client agreement which includes order execution policy, conflict of interest policy, <a href=${privacyPolicyLink} target='_blank'>privacy policy</a>, 3rd party disclosure policy and any other terms in the <a href=${clientAgreementLink} target='_blank'>client agreement</a>.`,
          `You confirm that you do not breach any regulation of your country of residence in trading with ${clientName}.`,
          'Your electronic signature is considered a legal and official signature'],
      };
      params = await service.checkCustomerSettings(
        params,
        FOREX,
        INDIVIDUAL,
        LIVE,
      );
      const rec = await service.create(params);
      walletService.generateSystemWallets({
        customerId: rec._id,
      });
      if (params.sendWelcomeEmail) {
        systemEmailService.sendSystemEmail(EMAIL_ACTIONS.REGISTER_INDIVIDUAL, {
          to: params.email,
          ...params,
          lang: rec?.language,
          password: pass,
        });
      }
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async createClient(req, res, next) {
    if (req.body?.category === CONSTANTS.CUSTOMER_CATEGORIES.FOREX) {
      return this.createFxRecord(req, res, next);
    }
    if (req.body?.category === CONSTANTS.CUSTOMER_CATEGORIES.SP) {
      return this.createSpRecord(req, res, next);
    }
    if (req.body?.category === CONSTANTS.CUSTOMER_CATEGORIES.INVESTOR) {
      return this.createInvestorRecord(req, res, next);
    }
    // Below is hte default Client
    try {
      const password = req.body.password ? encryptPassword(req.body.password) : encryptPassword('123456');
      const params = {
        ...req.body,
        email: req.body.email.toLowerCase(),
        ip: req.headers['x-real-ip'],
        createdBy: req.user._id,
        category: CONSTANTS.CUSTOMER_CATEGORIES.CRYPTO,
        source: CONSTANTS.CUSTOMER_SOURCES.CRM,
        isLead: false,
        password,
        declarations: defaultDeclaration,
      };
      const rec = await service.create(params);
      if (!params.isLead) {
        walletService.generateSystemWallets({
          customerId: rec._id,
        });
      } else {
        dwalletService.generateSystemWallets({
          customerId: rec._id,
        });
      }
      if (params.sendWelcomeEmail) {
        systemEmailService.sendSystemEmail(EMAIL_ACTIONS.REGISTER_INDIVIDUAL, {
          to: params.email,
          ...params,
          lang: rec?.language,
          password,
        });
      }
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async createSpRecord(req, res, next) {
    try {
      const pass = req.body.password ? req.body.password : generatePassword(12);
      let params = {
        ...req.body,
        email: req.body.email.toLowerCase(),
        ip: req.headers['x-real-ip'],
        createdBy: req.user._id,
        isLead: false,
        password: encryptPassword(pass),
        declarations: defaultDeclaration,
      };
      params = await service.checkCustomerSettings(
        params,
        FOREX,
        INDIVIDUAL,
        LIVE,
      );
      const rec = await service.create(params);
      if (!params.isLead) {
        walletService.generateSystemWallets({
          customerId: rec._id,
        });
      } else {
        dwalletService.generateSystemWallets({
          customerId: rec._id,
        });
      }
      if (params.sendWelcomeEmail) {
        systemEmailService.sendSystemEmail(EMAIL_ACTIONS.REGISTER_INDIVIDUAL, {
          to: params.email,
          ...params,
          lang: rec?.language,
          password: pass,
        });
      }
      requestService.createSpRequest({
        customerId: rec._id,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async createInvestorRecord(req, res, next) {
    try {
      const password = req.body.password ? (req.body.password) : (defaultPassword);
      let params = {
        ...req.body,
        email: req.body.email.toLowerCase(),
        ip: req.headers['x-real-ip'],
        createdBy: req.user._id,
        isLead: false,
        password: encryptPassword(password),
        declarations: defaultDeclaration,
      };
      params = service.checkCustomerSettings(
        params,
        CONSTANTS.CUSTOMER_CATEGORIES.FOREX,
        CONSTANTS.CUSTOMER_TYPES.INDIVIDUAL,
        CONSTANTS.CUSTOMER_SUB_TYPES.INVESTOR,
      );
      const rec = await service.create(params);
      if (!params.isLead) {
        walletService.generateSystemWallets({
          customerId: rec._id,
        });
      } else {
        dwalletService.generateSystemWallets({
          customerId: rec._id,
        });
      }
      if (params.sendWelcomeEmail) {
        systemEmailService.sendSystemEmail(EMAIL_ACTIONS.REGISTER_INDIVIDUAL, {
          to: params.email,
          ...params,
          lang: rec?.language,
          password,
        });
      }
      requestService.createInvestorRequest({
        customerId: rec._id,
        userId: req.user._id,
      }, {}, true);
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async createIbRecord(req, res, next) {
    try {
      const pass = generatePassword(12);
      let params = {
        ...req.body,
        email: req.body.email.toLowerCase(),
        language: req.body.language || 'en',
        ip: req.headers['x-real-ip'],
        createdBy: req.user._id,
        category: CONSTANTS.CUSTOMER_CATEGORIES.FOREX,
        source: CONSTANTS.CUSTOMER_SOURCES.CRM,
        salesRef: req.user.recordId,
        isLead: false,
        password: encryptPassword(pass),
        declarations: [`By clicking here I give my consent for ${clientName} to contact me for marketing purposes. You can opt out at any time. For further details please see our Marketing and Communication Policy Statement.`,
          `You have read, understood, and agreed to ${clientName}'s client agreement which includes order execution policy, conflict of interest policy, <a href=${privacyPolicyLink} target='_blank'>privacy policy</a>, 3rd party disclosure policy and any other terms in the <a href=${clientAgreementLink} target='_blank'>client agreement</a>.`,
          `You have read, understood, acknowledged, and agreed to all ${clientName}'s policies, terms & conditions and client agreements which are available on the company's <a href=${companyWebsite} target='_blank'>website</a>`,
          `You confirm that you do not breach any regulation of your country of residence in trading with ${clientName}.`,
          'Your electronic signature is considered a legal and official signature'],
      };
      const agreement = {
        values: req.body.values,
        title: req.body.ibTitle,
      };
      params = await service.checkCustomerSettings(
        params,
        FOREX,
        INDIVIDUAL,
        IB,
      );
      const rec = await service.create(params);
      walletService.generateSystemWallets({
        customerId: rec._id,
      });
      await accountService.createIbAccount({
        customer: rec,
      });
      const customer = await service.findById(rec._id, {}, true, [{
        path: 'agent',
        select: 'firstName lastName email',
      }]);
      ibAgrementService.createMasterAgrement(customer, agreement.title, agreement.values);
      requestService.createIbRequest(rec._id, true);
      if (params.sendWelcomeEmail) {
        systemEmailService.sendSystemEmail(EMAIL_ACTIONS.REGISTER_INDIVIDUAL, {
          to: params.email,
          ...params,
          lang: params.language,
          password: pass,
        });
      }
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, customer);
    } catch (error) {
      return next(error);
    }
  }

  async getPaginate(req, res, next) {
    try {
      if (req.query.type) { delete req.query.type; }
      let { query } = req;
      query = addAgentToQuery(req.user, query);
      const rec = await service.getCustomersV2(query);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async updateRecordById(req, res, next) {
    try {
      const { id } = req.params;
      const { body } = req;
      const { corporatePersonnel, ...rest } = body;
      if (body.agent === '') body.agent = null;
      const rec = await service.updateCustomerInfo(id, { ...rest, updatedBy: req.user._id }, {
        corporatePersonnel,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async deleteRecordById(req, res, next) {
    try {
      const { id } = req.params;
      const rec = await service.updateById(id, { isDeleted: true });
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
      const rec = await service.aggregate([
        {
          $match: {
            _id: Types.ObjectId(req.params.id),
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'agent',
            foreignField: '_id',
            as: 'agent',
            pipeline: [{
              $project: {
                firstName: 1,
                lastName: 1,
                email: 1,
              },
            }],
          },
        },
        {
          $unwind: {
            path: '$agent',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'markup',
            localField: 'markupId',
            foreignField: '_id',
            as: 'markupId',
            pipeline: [{
              $project: {
                title: 1,
              },
            }],
          },
        },
        {
          $unwind: {
            path: '$markupId',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'tradingFee',
            localField: 'tradingFeeId',
            foreignField: '_id',
            as: 'tradingFeeId',
            pipeline: [
              {
                $project: {
                  title: 1,
                },
              },
            ],
          },
        },
        {
          $unwind: {
            path: '$tradingFeeId',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $graphLookup: {
            from: 'customers',
            startWith: '$parentId',
            connectFromField: 'parentId',
            connectToField: '_id',
            as: 'parent',
            maxDepth: 10,
            depthField: 'depth',
          },
        },
      ]);
      let level = 0;
      const record = rec[0];
      if (record.parent.length > 0) {
        record.parent.forEach((element) => {
          if (element.depth > level) {
            level = element.depth;
          }
        });
        record.parentId = {
          ...record.parentId,
          ...record.parent[0],
          level: level + 1,
        };
        delete record.parent;
      } else {
        // make level 0
        record.parentId = {
          ...record.parentId,
          level: 0,
        };
      }
      record.password = await decryptPassword(record.password);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, record);
    } catch (error) {
      return next(error);
    }
  }

  async registerLive(req, res, next) {
    try {
      const params = {
        ...req.body,
        password: await encryptPassword(req.body.password),
        category: CONSTANTS.CUSTOMER_TYPES.LIVE,
        source: CONSTANTS.CUSTOMER_SOURCES.LIVE,
      };
      const rec = await service.create(params);
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async clientAccess(req, res, next) {
    try {
      const { id, status } = req.params;
      const rec = await service.updateById(id, { isActive: status === 'activate' });
      if (status === 'deactivate') {
        service.endAllSessions(id);
      }
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { password } = req.body;
      const { id } = req.params;
      const rec = await service.changePassword(id, password);
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const { id } = req.params;
      const rec = await service.forgotPassword(null, id);
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async updateFinancialInfo(req, res, next) {
    try {
      const { id } = req.params;
      const rec = await service.updateById(id, req.body);
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async updateEmploymentInfo(req, res, next) {
    try {
      const { id } = req.params;
      const rec = await service.updateById(id, req.body);
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async sendEmailLink(req, res, next) {
    try {
      const { email } = req.body;
      const client = await service.findOne({ email }, {}, { lean: false });
      if (!client) {
        return res.send({ message: 'Error Sending email' });
      }
      await systemEmailService.sendMail({
        to: email,
        subject: 'Password Reset',
        body: `Kindly click here to reset your password.
        ${process.env.CLIENT_PORTAL_URL}reset-password`,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, { message: 'Email has been sent correctly' });
    } catch (error) {
      return next(error);
    }
  }

  async disableTwoFactorAuth(req, res, next) {
    const { customerId } = req.body;
    try {
      const verified = await service.disableTwoFactorAuth(customerId);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, verified);
    } catch (err) {
      return next(err);
    }
  }

  async checkEmail(req, res, next) {
    try {
      const email = req.query.email ? req.query.email.toLowerCase() : req.query.email;
      const rec = await service.checkEmail(email);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async convertToIB(req, res, next) {
    try {
      const { customer } = req;
      const rec = await service.convertToIB({ customer, user: req.user });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async convertToCrypto(req, res, next) {
    try {
      const { customer } = req;
      const rec = await service.convertToCrypto({ customer, user: req.user });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async convertToFx(req, res, next) {
    try {
      const { customer } = req;
      const rec = await service.convertToFx({ customer, user: req.user });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async convertToLive(req, res, next) {
    try {
      const { customer } = req;
      const rec = await service.convertDemoToLive({
        isDemo: true,
        customerId: customer._id,
        user: req.user,
        ip: req.headers['x-real-ip'],
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async assignAgent(req, res, next) {
    try {
      const rec = await service.assignAgent(req.body, req.user._id);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async updateCallStatus(req, res, next) {
    try {
      const { id } = req.params;
      const rec = await service.updateCallStatus(id, { ...req.body, updatedBy: req.user._id });
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getMT5Markups(req, res, next) {
    try {
      const dummyData = ['real\\real', 'demo\\demo', 'demo\\forex.ABI'];

      return ApiResponse(res, true, ResponseMessages.GET_MT5_MARKUP_SUCCESS, dummyData);
    } catch (error) {
      return next(error);
    }
  }

  async countClientGroups(req, res, next) {
    try {
      const rec = await service.countClientGroups();
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new CustomerController();
