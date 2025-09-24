/* eslint-disable class-methods-use-this */
const { ResponseMessages, CONSTANTS } = require('src/common/data');
const {
  ApiResponse, encryptPassword, addAgentToQuery, SendEvent, generatePassword
} = require('src/common/handlers');

const {
  customerService: service,
  dWalletService: dwalletService,
  systemEmailService
} = require('src/modules/services');
const {
  EVENT_TYPES,
  LOG_TYPES,
  LOG_LEVELS,
  EMAIL_ACTIONS,
  CUSTOMER_CATEGORIES,
  CUSTOMER_TYPES,
  CUSTOMER_SUB_TYPES,
} = require('../../../../common/data/constants');
// const { EMAIL_ACTIONS } = require('../../../../common/data/constants');

class CustomerController {
  async createLead(req, res, next) {
    try {
      const pass = req.body.password ? req.body.password : generatePassword(12);
      let params = {
        ...req.body,
        email: req.body.email.toLowerCase(),
        ip: req.headers['x-real-ip'],
        createdBy: req.user._id,
        isLead: true,
        source: req.body.source || 'CRM',
        /* TODO: This password should be generated automatically and to the user via email  */
        password: req.body.password ? encryptPassword(req.body.password) : encryptPassword(pass),
      };
      params = await service.checkCustomerSettings(
        params,
        req.body.category || CUSTOMER_CATEGORIES.CRYPTO,
        CUSTOMER_TYPES.INDIVIDUAL,
        CUSTOMER_SUB_TYPES.DEMO,
      );
      const rec = await service.create(params);
      dwalletService.generateSystemWallets({
        customerId: rec._id,
      });

      // register welcome email
      if (params.sendWelcomeEmail) {
        systemEmailService.sendSystemEmail(EMAIL_ACTIONS.REGISTER_DEMO, {
          to: params.email,
          ...params,
          password: pass,
          lang: rec?.language,
        });
      }

      SendEvent(
        EVENT_TYPES.EVENT_LOG,
        LOG_TYPES.CREATE_LEAD,
        {
          customerId: null,
          userId: params.createdBy,
          triggeredBy: 1,
          userLog: true,
          level: LOG_LEVELS.INFO,
          details: {},
          content: { lead: params.email },
        },
      );
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async createLeadFromWebsite(req, res, next) {
    console.log('req.body', req.body);
    try {
      const pass = req.body.password ? req.body.password : generatePassword(12);
      const fullNameArray = req.body.fullName?.split(" ");
      fullNameArray.shift();
      const lastName = fullNameArray.join(" ");
      let params = {
        ...req.body,
        firstName: req.body.fullName?.split(" ")[0],
        lastName: lastName,
        email: req.body.email?.toLowerCase(),
        ip: req.headers['x-real-ip'],
        isLead: true,
        source: req.body.source || 'CRM',
        /* TODO: This password should be generated automatically and to the user via email  */
        password: req.body.password ? encryptPassword(req.body.password) : encryptPassword(pass),
      };
      params = await service.checkCustomerSettings(
        params,
        req.body.category || CUSTOMER_CATEGORIES.CRYPTO,
        CUSTOMER_TYPES.INDIVIDUAL,
        CUSTOMER_SUB_TYPES.DEMO,
      )
      const rec = await service.create(params);
      dwalletService.generateSystemWallets({
        customerId: rec._id,
      });

      // register welcome email
      if (params.sendWelcomeEmail) {
        systemEmailService.sendSystemEmail(EMAIL_ACTIONS.REGISTER_DEMO, {
          to: params.email,
          ...params,
          password: pass,
          lang: rec?.language,
        });
      }

      SendEvent(
        EVENT_TYPES.EVENT_LOG,
        LOG_TYPES.CREATE_LEAD,
        {
          customerId: null,
          userId: params.createdBy,
          triggeredBy: 1,
          userLog: true,
          level: LOG_LEVELS.INFO,
          details: {},
          content: { lead: params.email },
        },
      );
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async createExcelLead(req, res, next) {
    try {
      const leadsExcel = req.file.path;
      const rec = await service.addLeadsExcel({
        leads: leadsExcel,
        createdBy: req.user._id,
        source: req.body.source || ""
      });
      const response = rec.map((lead) => lead._doc);

      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, response);
    } catch (error) {
      return next(error);
    }
  }

  async getPaginate(req, res, next) {
    try {
      let { query = {} } = req;
      query = addAgentToQuery(req.user, query);
      const rec = await service.getLeads({
        ...query,
        isLead: true,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async updateRecordById(req, res, next) {
    try {
      const { id } = req.params;
      const rec = await service.updateCustomerInfo(id, { ...req.body, updatedBy: req.user._id });
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
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

  async deleteRecordById(req, res, next) {
    try {
      const { id } = req.params;
      const rec = await service.updateById(id, { isDeleted: true });
      return ApiResponse(res, true, ResponseMessages.RECORD_DELETE_SUCCESS, rec);
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

  async registerDemo(req, res, next) {
    try {
      const params = {
        ...req.body,
        password: await encryptPassword(req.body.password),
        category: CONSTANTS.CUSTOMER_TYPES.DEMO,
        source: CONSTANTS.CUSTOMER_SOURCES.DEMO,
      };
      const rec = await service.create(params);
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async convertLeadToClient(req, res, next) {
    try {
      const customerId = req.params.id;
      const rec = await service.convertLeadToClient(customerId);
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
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
}

module.exports = new CustomerController();
