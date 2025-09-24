const mongoose = require('mongoose');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const XLSX = require('xlsx');
const moment = require('moment');

const {
  Cruds,
  SendEvent,
  comparePassword,
  encryptPassword,
  generatePassword,
  dbConnectionUpCb,
  getCustomerCategory,
} = require('src/common/handlers');
const { logger, redis } = require('src/common/lib');
const { CONSTANTS, keys, ResponseMessages } = require('src/common/data');
const { twoFAClientName } = require('src/common/data/keys');

const CustomerModel = require('./customer.model');
const UserService = require('../users/users.service');
const { kycReshape } = require('../../utils/kycReshape');
const { CALL_STATUS, PUSH_NOTIFICATION_GROUPS } = require('../../common/data/constants');
const ibagrementService = require('../fx/ibagrement/ibagrement.service');
const customersFacetPipeline = require('./customersFacetPipeline');
const fileHandler = require('../azure-multer/file-handler');

let feeGroupService;
let transactionFeeGroupService;
let markupService;
let systemEmailService;
let agrementService;
let requestsService;
let accountService;

const {
  LOG_TYPES,
  LOG_LEVELS,
  EMAIL_ACTIONS,
  EVENT_TYPES,
  CUSTOMER_CATEGORIES,
} = CONSTANTS;

const getCallStatusGroup = (callStatus = []) => {
  const d = {};
  Object.keys(CALL_STATUS).forEach((key) => {
    if (callStatus.includes(CALL_STATUS[key])) {
      d[CALL_STATUS[key]] = {
        $addToSet: {
          $cond: [
            { $eq: ['$callStatus', CALL_STATUS[key]] },
            '$$ROOT',
            '$$REMOVE',
          ],
        },
      };
    }
  });
  return d;
};

const isAlphaNumeric = (str) => {
  // need to support all the languages.
  // const regex = new RegExp(/[^\p{L}\p{N}]+/ug);
  const regex = /^[A-zÀ-Ÿ\d-]*$/;
  return !regex.test(str);
};

const customerFilter = (query = {}) => {
  if (query.fxType === 'CLIENT') {
    query = { ...query, 'fx.isClient': true };
    delete query.fxType;
  } else if (query.fxType === 'IB') {
    query = { ...query, 'fx.isIb': true };
    delete query.fxType;
  }
  if (query.searchText) {
    // if (!isAlphaNumeric(query.searchText)) {
    //   query.searchText = query.searchText.trim();
    // } else if (parseInt(query.searchText, 10)) {
    //   query.filteredValues.login = query.searchText;
    //   query.searchText = '';
    // }
    // if the searchText contains only numbers set login and if the length is less than 7
    // if the searchText contains only alphabets to searchText only
    if (parseInt(query.searchText, 10) && query.searchText.length < 10) {
      if (query.filteredValues) {
        query.filteredValues.login = query.searchText;
      } else {
        query.filteredValues = { login: query.searchText };
      }
      query.searchText = '';
    } else if (parseInt(query.searchText, 10) && query.searchText.length >= 10) {
      query.searchText = String(query.searchText)?.trim();
    }
  }
  // filter code
  const { filteredValues = null } = query;
  delete query.filteredValues;
  if (filteredValues) {
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(filteredValues)) {
      if (value && value !== '') {
        const insensitiveRegex = (searchVal) => ({ $regex: new RegExp(`^${searchVal}`, 'i') });
        switch (key) {
          case 'country':
            query = { ...query, country: value };
            break;
          case 'type':
            query = { ...query, category: value };
            break;
          case 'source':
            query = { ...query, source: value };
            break;
          case 'firstName':
            query = { ...query, firstName: insensitiveRegex(value) };
            break; case 'lastName':
            query = { ...query, lastName: insensitiveRegex(value) };
            break;
          case 'callStatus':
            query = { ...query, callStatus: value };
            break;
          case 'email':
            query = { ...query, email: insensitiveRegex(value?.trim()) };
            break;
          case 'gender':
            query = { ...query, gender: value };
            break;
          case 'login':
            query = {
              ...query,
              $expr: {
                $or: [
                  { $in: [parseInt(value, 10), { $ifNull: ['$fx.liveAcc', []] }] },
                  { $in: [parseInt(value, 10), { $ifNull: ['$fx.demoAcc', []] }] },
                  { $in: [parseInt(value, 10), { $ifNull: ['$fx.ibMT5Acc', []] }] },
                  { $in: [parseInt(value, 10), { $ifNull: ['$fx.ibMT4Acc', []] }] },
                  { $in: [parseInt(value, 10), { $ifNull: ['$fx.ibCTRADERAcc', []] }] },
                ],
              },
            };
            break;
          case 'assigne':
            switch (value.toLowerCase()) {
              case 'unassigned':
                query = query.$and
                  ? {
                    ...query,
                    $and: [
                      ...query.$and,
                      { agent: { $eq: null } },
                    ],
                  }
                  : {
                    ...query,
                    $and: [{ agent: { $eq: null } }],
                  };
                break;
              case 'assigned':
                query = query.$and
                  ? {
                    ...query,
                    $and: [
                      ...query.$and,
                      { agent: { $ne: null } },
                    ],
                  }
                  : {
                    ...query,
                    $and: [{ agent: { $ne: null } }],
                  };
                break;
              default:
                break;
            }
            break;
          case 'agent':
            query = query.$and
              ? {
                ...query,
                $and: [
                  ...query.$and,
                  { agent: { $in: value.split(',').map((x) => mongoose.Types.ObjectId(x)) } },
                ],
              }
              : {
                ...query,
                $and: [{ agent: { $in: value.split(',').map((x) => mongoose.Types.ObjectId(x)) } }],
              };
            break;
          case 'filterDate':
            if (value.fromDate && value.toDate) {
              query = {
                ...query,
                createdAt: { $gte: new Date(value.fromDate), $lte: new Date(value.toDate) },
              };
            } else {
              if (value.fromDate) {
                query = { ...query, createdAt: { $gte: new Date(value.fromDate) } };
              }
              if (value.toDate) {
                query = { ...query, createdAt: { $lte: new Date(value.toDate) } };
              }
            }
            break;
          case 'kyc':
            if (value) {
              const kycVal = kycReshape(value);
              query = { ...query, ...kycVal };
            }
            break;
          case 'categories':
            if (value === 'Individual') {
              query = {
                ...query,
                'fx.isClient': true,
              };
            }
            if (value === 'IB') {
              query = {
                ...query,
                'fx.isIb': true,
              };
            }
            if (value === 'Corporate') {
              query = {
                ...query,
                'fx.isClient': true,
                isCorporate: true,
              };
            }
            if (value === 'Corporate IB') {
              query = {
                ...query,
                'fx.isIb': true,
                isCorporate: true,
              };
            }
            break;
          case 'parentId':
            query = {
              ...query,
              parentId: { $in: value.split(',').map((x) => mongoose.Types.ObjectId(x)) },
            };
            break;
          default:
            query = { ...query, key: value };
        }
      }
    }
  }
  query.isLead = { $in: [false, undefined] };
  return query;
};

const leadFilter = (query = {}) => {
  const { filteredValues = null } = query;
  delete query.filteredValues;
  if (filteredValues) {
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(filteredValues)) {
      if (value && value !== '') {
        const insensitiveRegex = (searchVal) => ({ $regex: new RegExp(`^${searchVal}`, 'i') });
        switch (key) {
          case 'country':
            query = { ...query, country: value };
            break;
          case 'type':
            query = { ...query, category: value };
            break;
          case 'source':
            query = { ...query, source: value };
            break;
          case 'firstName':
            query = { ...query, firstName: insensitiveRegex(value) };
            break;
          case 'lastName':
            query = { ...query, lastName: insensitiveRegex(value) };
            break;
          case 'email':
            query = { ...query, email: insensitiveRegex(value?.trim()) };
            break;
          case 'gender':
            query = { ...query, gender: value };
            break;
          case 'callStatus':
            query = { ...query, callStatus: value };
            break;
          case 'assigne':
            switch (value.toLowerCase()) {
              case 'unassigned':
                query = query.$and
                  ? {
                    ...query,
                    $and: [
                      ...query.$and,
                      { agent: { $eq: null } },
                    ],
                  }
                  : {
                    ...query,
                    $and: [{ agent: { $eq: null } }],
                  };
                break;
              case 'assigned':
                query = query.$and
                  ? {
                    ...query,
                    $and: [
                      ...query.$and,
                      { agent: { $ne: null } },
                    ],
                  }
                  : {
                    ...query,
                    $and: [{ agent: { $ne: null } }],
                  };
                break;
              default:
                break;
            }
            break;
          case 'agent':
            query = query.$and
              ? {
                ...query,
                $and: [
                  ...query.$and,
                  { agent: { $in: value.split(',') } },
                ],
              }
              : {
                ...query,
                $and: [{ agent: { $in: value.split(',') } }],
              };
            break;
          case 'filterDate':
            if (value.fromDate && value.toDate) {
              query = {
                ...query,
                createdAt: { $gte: new Date(value.fromDate), $lte: new Date(value.toDate) },
              };
            } else {
              if (value.fromDate) {
                query = { ...query, createdAt: { $gte: new Date(value.fromDate) } };
              }
              if (value.toDate) {
                query = { ...query, createdAt: { $lte: new Date(value.toDate) } };
              }
            }
            break;
          default:
            query = { ...query, key: value };
        }
      }
    }
  }
  return query;
};
class CustomerService extends Cruds {
  async checkCustomerSettings(
    params,
    category = keys.defaultPortal,
    type = keys.defaultCustomerType,
    subType = keys.defaultSubType,
  ) {
    if (!params.markupId) {
      const mId = await markupService.findOne({ isDefault: true }, { _id: 1 });
      params.markupId = mId && mId._id;
    }
    if (!params.transactionFeeId) {
      const tId = await transactionFeeGroupService.findOne(
        { isDefault: true },
        { _id: 1 },
      );
      params.transactionFeeId = tId && tId._id;
    }
    if (!params.tradingFeeId) {
      const tId = await feeGroupService.findOne({ isDefault: true }, { _id: 1 });
      params.tradingFeeId = tId && tId._id;
    }
    switch (category) {
      case CUSTOMER_CATEGORIES.FOREX:
        params = this.forexSettings(params, type, subType);
        break;
      case CUSTOMER_CATEGORIES.CRYPTO:
        params = this.cryptoSettings(params, type, subType);
        break;
      case CUSTOMER_CATEGORIES.GOLD:
        params = this.goldSettings(params, type, subType);
        break;
      case CUSTOMER_CATEGORIES.MM:
        params = this.mmSettings(params, type, subType);
        break;
      default:
        params = this.getDefaultSettings(params, type, subType);
        break;
    }
    return params;
  }

  forexSettings(params, type, subType) {
    let defaultSubPortal = keys.subTypes.LIVE;
    if (subType === keys.subTypes.DEMO || subType === keys.subTypes.LIVE) {
      defaultSubPortal = keys.subTypes.LIVE;
    } else {
      defaultSubPortal = keys.subTypes[subType];
    }
    params = {
      ...params,
      isCorporate: type === keys.customerTypes.CORPORATE,
      defaultPortal: keys.portals.FOREX,
      defaultSubPortal,
      fx: {
        isDemo: subType === keys.subTypes.DEMO,
        isClient: subType === keys.subTypes.LIVE,
        isIb: subType === keys.subTypes.IB,
      },
    };
    return params;
  }

  cryptoSettings(params, type, subType) {
    params = {
      ...params,
      isCorporate: type === keys.customerTypes.CORPORATE,
      defaultPortal: keys.portals.CRYPTO,
      defaultSubPortal: subType,
      crypto: {
        isDemo: subType === keys.subTypes.DEMO,
        isClient: subType === keys.subTypes.LIVE,
        isIb: subType === keys.subTypes.IB,
      },
    };
    return params;
  }

  goldSettings(params, type, subType) {
    params = {
      ...params,
      isCorporate: type === keys.customerTypes.CORPORATE,
      defaultPortal: keys.portals.GOLD,
      defaultSubPortal: subType,
      gold: {
        isDemo: subType === keys.subTypes.DEMO,
        isClient: subType === keys.subTypes.LIVE,
      },
    };
    return params;
  }

  mmSettings(params, type, subType) {
    params = {
      ...params,
      isCorporate: type === keys.customerTypes.CORPORATE,
      defaultPortal: keys.portals.MM,
      defaultSubPortal: subType,
      mm: {
        isDemo: subType === keys.subTypes.DEMO,
        isClient: subType === keys.subTypes.LIVE,
      },
    };
    return params;
  }

  getDefaultSettings(params) {
    const defaultPortal = keys.customerDefaultPortal;
    const defaultSubPortal = keys.customerDefaultSubPortal;
    switch (keys.defaultPortal) {
      case CUSTOMER_CATEGORIES.FOREX:
        params = {
          ...params,
          defaultPortal,
          defaultSubPortal,
          isCorporate: keys.defaultCustomerType === keys.customerTypes.CORPORATE,
          fx: {
            isDemo: keys.defaultSubType === keys.subTypes.DEMO,
            isClient: keys.defaultSubType === keys.subTypes.LIVE,
            isIb: keys.defaultSubType === keys.subTypes.IB,
          },
        };
        break;
      case CUSTOMER_CATEGORIES.CRYPTO:
        params = {
          ...params,
          defaultPortal,
          defaultSubPortal,
          isCorporate: keys.defaultCustomerType === keys.customerTypes.CORPORATE,
          crypto: {
            isDemo: keys.defaultSubType === keys.subTypes.DEMO,
            isClient: keys.defaultSubType === keys.subTypes.LIVE,
          },
        };
        break;
      case CUSTOMER_CATEGORIES.GOLD:
        params = {
          ...params,
          defaultPortal,
          defaultSubPortal,
          isCorporate: keys.defaultCustomerType === keys.customerTypes.CORPORATE,
          gold: {
            isDemo: keys.defaultSubType === keys.subTypes.DEMO,
            isClient: keys.defaultSubType === keys.subTypes.LIVE,
          },
        };
        break;
      case CUSTOMER_CATEGORIES.MM:
        params = {
          ...params,
          defaultPortal,
          defaultSubPortal,
          isCorporate: keys.defaultCustomerType === keys.customerTypes.CORPORATE,
          mm: {
            isDemo: keys.defaultSubType === keys.subTypes.DEMO,
            isClient: keys.defaultSubType === keys.subTypes.LIVE,
          },
        };
        break;
      default:
        break;
    }
    return params;
  }

  bothAcctSettings(params) {
    return params;
  }

  async create(data) {
    const {
      parentRef = '',
      agRef = '',
      salesRef = '',
      ibId = '',
      ibRef = '',
      ...params
    } = data;
    let pushNotificationData = {};
    let customer;
    if (parentRef || (ibId !== '' && ibId !== null)) {
      // to check for the migrated clients old dedicated links
      if (ibId !== '' && ibId !== null) {
        customer = await this.findOne({
          oldRecordId: ibId
        });
      } else {
        customer = await this.findOne({
          recordId: parentRef,
        });
      }
      if (customer) {
        params.parentId = customer._id;
        params.parentLinkTime = new Date();
        let agrement;
        // to check for the migrated clients old dedicated links
        if (ibRef !== '' && ibRef !== null && params.fx) {
          agrement = await agrementService.findOne({
            oldRecordId: ibRef
          });
          if (agrement) {
            pushNotificationData = {
              ...pushNotificationData,
              agrement: {
                name: agrement.title,
              },
            };
            params.fx.agrementId = agrement._id;
            params.fx.agrementLinkTime = new Date();
          }
        }
        if (agRef && params.fx) {
           agrement = await agrementService.findOne({
            recordId: agRef,
            'members.customerId': customer._id,
          });
          if (agrement) {
            pushNotificationData = {
              ...pushNotificationData,
              agrement: {
                name: agrement.title,
              },
            };
            params.fx.agrementId = agrement._id;
            params.fx.agrementLinkTime = new Date();
          }
        }
      }
    }
    let user;
    if (salesRef) {
      user = await UserService.findOne({ recordId: parseInt(salesRef, 10) });
      if (user) {
        params.agent = user._id;
      }
    }
    await this.checkEmail(params.email);
    const addObj = await super.create({
      ...params,
      email: params.email.toLowerCase(),
      experience: {
        jobTitle: params.jobTitle || '',
        employer: params.companyName || '',
      },
    });
    SendEvent(
      EVENT_TYPES.EVENT_LOG,
      LOG_TYPES.REGISTER,
      {
        customerId: addObj._id,
        userId: params.createdBy,
        triggeredBy: params.createdBy ? 1 : 0,
        userLog: false,
        level: LOG_LEVELS.INFO,
        details: { ip: params.ip, category: params.category, isLead: params.isLead },
        content: params,
      },
      params.isLead,
    );
    if (salesRef && user) {
      SendEvent(
        EVENT_TYPES.PUSH_NOTIFICATION,
        {
          pushNotificationType: PUSH_NOTIFICATION_GROUPS.USERS.CLIENT_REGISTERED,
          pushNotificationGroup: Object.keys(PUSH_NOTIFICATION_GROUPS).find((key) => key === 'USERS'),
          to: [user._id.toString()],
        },
        {
          client: {
            firstName: addObj.firstName,
            lastName: addObj.lastName,
            email: addObj.email,
            recordId: addObj.recordId,
            _id: addObj._id.toString(),
          },
          agent: {
            _id: user._id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            recordId: user.recordId,
          },
        },
      );
    }
    if (customer) {
      SendEvent(
        EVENT_TYPES.PUSH_NOTIFICATION,
        {
          pushNotificationType: PUSH_NOTIFICATION_GROUPS.CLIENT.CLIENT_REGISTERED,
          pushNotificationGroup: Object.keys(PUSH_NOTIFICATION_GROUPS).find((key) => key === 'CLIENT'),
          to: [customer._id.toString()],
        },
        {
          ...pushNotificationData,
          client: {
            firstName: addObj.firstName,
            lastName: addObj.lastName,
            email: addObj.email,
            recordId: addObj.recordId,
            _id: addObj._id.toString(),
          },
        },
      );
    }
    delete addObj.password;
    return addObj;
  }

  async addLead(params) {
    const lead = {
      ...params,
      email: params.email.toLowerCase(),
      category: CONSTANTS.CUSTOMER_TYPES.DEMO,
      password: params.password ? encryptPassword(params.password) : null,
    };
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
        content: lead,
      },
    );
    return this.create(lead);
  }

  async addLeadsExcel(params) {
    const { leads, source } = params;
    const workbook = XLSX.readFile(leads, { cellDates: true, dateNF: 'dd/mm/yyyy' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const leadsData = XLSX.utils.sheet_to_json(sheet);
    const result = [];
    for (let i = 0; i < leadsData.length; i += 1) {
      const lead = leadsData[i];
      let firstName = '--';
      let lastName = '--';
      let phone = '0';
      let country = 'N/a';
      const checkName = !lead.firstName;
      let skip = false;
      if (checkName) {
        const name = lead.name.trim().split(' ');
        if (name.length === 4) {
          firstName = `${name[0]} ${name[1]}`;
          lastName = `${name[2]} ${name[3]}`;
        } else if (name.length === 3) {
          firstName = `${name[0]} ${name[1]}`;
          lastName = name[2];
        } else if (name.length === 2) {
          firstName = name[0];
          lastName = name[1];
        } else {
          firstName = name[0];
        }
      } else {
        firstName = lead.firstName;
        lastName = lead.lastName;
        if (!firstName || !lastName) {
          logger.info(`Lead ${lead.email} has no name. Skipping...`);
          skip = true;
        }
      }
      if (lead.phone) {
        phone = lead.phone.toString().replace(/[^0-9]/g, '');
        phone = `+${phone}`;
      }
      if (lead.country) {
        country = lead.country;
      }
      const leadObj = {
        ...lead,
        firstName,
        lastName,
        phone,
        country,
        email: lead.email.toLowerCase(),
        category: CONSTANTS.CUSTOMER_CATEGORIES.FOREX,
        createdAt: new Date(moment(lead.date).add(5, 'hours').format('YYYY-MM-DD HH:mm:ss')),
        password: lead.password ? encryptPassword('123456') : null,
        isLead: true,
        source,
      };
      params = this.checkCustomerSettings(
        leadObj,
        CONSTANTS.CUSTOMER_CATEGORIES.FOREX,
        CONSTANTS.CUSTOMER_TYPES.INDIVIDUAL,
        CONSTANTS.CUSTOMER_SUB_TYPES.DEMO,
      );
      // find lead in current database
      const leadExist = await this.findOne({ email: leadObj.email });
      if (leadExist) {
        skip = true;
        logger.info(`Lead ${leadObj.email} already exist in database.`);
      }
      if (!skip) {
        logger.info(`Adding lead ${leadObj.email}: ${leadObj.firstName} ${leadObj.lastName}`);
        result.push(this.create(leadObj));
      }
    }
    return Promise.all(result);
  }

  async login(email, password, ip = null) {
    const customer = await this.findOne({
      email: email.toLowerCase().trim(),
    }, {}, { lean: false });

    if (!customer) throw new Error(ResponseMessages.NO_SUCH_USER.message);
    if (!customer.isActive) throw new Error(ResponseMessages.LOGIN_FAIL.message);
    const passwordMatch = comparePassword(password, customer.password);
    // if (!passwordMatch) throw new Error(ResponseMessages.LOGIN_FAIL.message);
    if (passwordMatch && customer.settings && customer.settings.twoFactorAuthEnabled) {
      return {
        twoFactorAuthEnabled: customer.settings.twoFactorAuthEnabled,
      };
    }
    if (passwordMatch && !customer.settings.twoFactorAuthEnabled) { // passwordMatch
      this.update({ _id: customer._id }, { lastLogin: new Date() });
      return this.generateLoginToken(customer, ip);
    }
    throw new Error(ResponseMessages.LOGIN_FAIL.message);
  }

  async generateLoginToken(customer, ip = null) {
    if (!customer || !customer.generateAuthToken) {
      throw new Error(ResponseMessages.LOGIN_FAIL.message);
    }
    const token = customer.generateAuthToken();
    SendEvent(
      EVENT_TYPES.EVENT_LOG,
      LOG_TYPES.LOGIN,
      {
        customerId: customer._id,
        userId: null,
        triggeredBy: 0,
        userLog: false,
        level: LOG_LEVELS.INFO,
        details: { ip },
        content: {},
      },
      customer.isLead,
    );
    redis.setKey(`${customer._id.toString()}:${token}`, { email: customer.email }, keys.cpTokenTime.seconds);
    const category = getCustomerCategory(customer);
    return {
      token,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      category,
      isLead: customer.isLead,
      defaultPortal: customer.defaultPortal || keys.customerDefaultPortal || 'FOREX',
      defaultSubPortal: customer.defaultSubPortal || keys.customerDefaultSubPortal || 'LIVE',
      twoFactorAuthEnabled: customer.settings.twoFactorAuthEnabled,
    };
  }

  async findById(id, projection, lean = true, populate = []) {
    if (!projection) projection = { password: 0 };
    return super.findById(id, { ...projection }, lean, populate);
  }

  async changePassword(customerId, password = '') {
    const pass = encryptPassword(password || generatePassword());
    logger.warn(['password changed to ', pass, ' for ', customerId]);
    SendEvent(
      EVENT_TYPES.EVENT_LOG,
      LOG_TYPES.CHANGE_PASSWORD,
      {
        customerId,
        userId: null,
        triggeredBy: 0,
        userLog: false,
        level: LOG_LEVELS.INFO,
        details: {},
        content: {},
      },
    );
    return this.updateById(customerId, { password: pass });
  }

  async changePasswordWithOldPassword(customerId, newPassword, oldPassword) {
    const customer = await CustomerModel.Model.findById(customerId);
    const passwordMatch = comparePassword((oldPassword), customer.password);
    if (!passwordMatch) throw new Error(ResponseMessages.INVALID_OLD_PASSWORD.message);
    return this.changePassword(customerId, newPassword);
  }

  async find(params = {}, projection = {}, options = {}) {
    if (!projection) {
      projection = { password: 0 };
    }
    return super.find(params, projection, options);
  }

  async findWithPagination(params = {}, options = {}, projection = { password: 0 }) {
    return super.findWithPagination(params, { ...options, projection });
  }

  async forgotPassword(email, _id) {
    const customer = email
      ? await this.findOne({ email }, {}, { lean: false })
      : await this.findOne({ _id }, {}, { lean: false });
    if (!customer) throw new Error(ResponseMessages.EMAIL_NOT_FOUND.message);
    if (!customer.isActive) throw new Error(ResponseMessages.EMAIL_NOT_FOUND.message);
    const token = customer.generateResetPasswordToken();
    redis.setKey(`${customer._id.toString()}:forgot_password:${token}`, { email: customer.email }, keys.cpTokenTime.seconds);
    const resetLink = `<a href="${keys.cpUrl}/reset-password?token=${token}" target="_blank"> <strong><i>Reset Password</i></strong> </a>`;
    console.log(`Reset link pswd: ${resetLink}`);
    systemEmailService.sendSystemEmail(EMAIL_ACTIONS.RESET_CP_PASSWORD_LINK, {
      to: customer.email,
      resetLink,
      ...customer,
      lang: customer?.language,
    });
    SendEvent(
      EVENT_TYPES.EVENT_LOG,
      LOG_TYPES.RESET_PASSWORD,
      {
        customerId: _id,
        userId: null,
        triggeredBy: 0,
        userLog: false,
        level: LOG_LEVELS.INFO,
        details: {},
        content: {},
      },
    );
    return true;
  }

  async assignAgents(params = {}, userId) {
    const {
      body,
      agentId,
      callStatus = null,
    } = params;
    const { clientIds } = body;
    const customers = await this.find({ _id: { $in: clientIds } }, {}, { lean: false });
    const agent = await UserService.findById(agentId);
    customers.forEach((customer) => {
      SendEvent(
        EVENT_TYPES.EVENT_LOG,
        LOG_TYPES.ASSIGN_AGENT,
        {
          customerId: customer._id,
          userId,
          triggeredBy: 1,
          userLog: true,
          level: LOG_LEVELS.INFO,
          details: {},
          content: {
            name: `${customer.firstName} ${customer.lastName}`,
            email: customer.email,
            agent: `${agent.firstName} ${agent.lastName}`,
            callStatus,
          },
        },
      );
      SendEvent(
        EVENT_TYPES.PUSH_NOTIFICATION,
        {
          pushNotificationType: PUSH_NOTIFICATION_GROUPS.USERS.CLIENT_ASSIGNED,
          pushNotificationGroup: Object.keys(PUSH_NOTIFICATION_GROUPS).find((key) => key === 'USERS'),
          from: userId,
          to: [agentId],
        },
        {
          client: {
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.email,
            recordId: customer.recordId,
            _id: customer._id.toString(),
          },
          agent: {
            _id: agent._id.toString(),
            firstName: agent.firstName,
            lastName: agent.lastName,
            email: agent.email,
            recordId: agent.recordId,
          },
        },
      );
    });
    return Promise.all(
      customers.map((customer) => this.updateById(customer._id, { agent, callStatus })),
    );
  }

  async getCustomers(params = {}) {
    const query = customerFilter(params);
    return this.findWithPagination(query, {
      populate: [{
        path: 'agent',
        select: 'firstName lastName email',
      }, {
        path: 'markupId',
        select: 'title',
      }, {
        path: 'tradingFeeId',
        select: 'title',
      }, {
        path: 'transactionFeeId',
        select: 'title',
      }, {
        path: 'parentId',
        select: '_id firstName lastName',
      }],
    });
  }

  async getCustomersV2(params = {}) {
    const query = customerFilter(params);
    const {
      page = 1,
      limit = 10,
      searchText,
      ...rest
    } = query;
    return this.aggregateWithStrictSearch([
      {
        $match: rest,
      },
      {
        $lookup: {
          from: 'users',
          localField: 'agent',
          foreignField: '_id',
          as: 'agent',
        },
      },
      {
        $unwind: {
          path: '$agent',
          preserveNullAndEmptyArrays: true,
        },
      }, {
        $lookup: {
          from: 'markupgroups',
          localField: 'markupId',
          foreignField: '_id',
          as: 'markupId',
        },
      }, {
        $unwind: {
          path: '$markupId',
          preserveNullAndEmptyArrays: true,
        },
      }, {
        $lookup: {
          from: 'feegroups',
          localField: 'tradingFeeId',
          foreignField: '_id',
          as: 'tradingFeeId',
        },
      }, {
        $unwind: {
          path: '$tradingFeeId',
          preserveNullAndEmptyArrays: true,
        },
      }, {
        $lookup: {
          from: 'transactionfeegroups',
          localField: 'transactionFeeId',
          foreignField: '_id',
          as: 'transactionFeeId',
        },
      }, {
        $unwind: {
          path: '$transactionFeeId',
          preserveNullAndEmptyArrays: true,
        },
      }, {
        $lookup: {
          from: 'customers',
          localField: 'parentId',
          foreignField: '_id',
          as: 'parentId',
        },
      }, {
        $unwind: {
          path: '$parentId',
          preserveNullAndEmptyArrays: true,
        },
      },
    ], searchText, {
      page,
      limit,
    });
  }

  async getLeads(params = {}) {
    const query = leadFilter(params);
    // return this.findWithPagination(query, {
    //   populate: [{
    //     path: 'agent',
    //     select: 'firstName lastName email',
    //   }, {
    //     path: 'parentId',
    //     select: 'firstName lastName',
    //   }],
    // });
    const {
      page = 1,
      limit = 10,
      searchText,
      ...rest
    } = query;
    const newAggregation = [];
    newAggregation.push({
      $match: rest,
    });
    newAggregation.push({
      $lookup: {
        from: 'users',
        localField: 'agent',
        foreignField: '_id',
        as: 'agent',
      },
    });
    newAggregation.push({
      $unwind: {
        path: '$agent',
        preserveNullAndEmptyArrays: true,
      },
    });
    newAggregation.push({
      $lookup: {
        from: 'customers',
        localField: 'parentId',
        foreignField: '_id',
        as: 'parentId',
      },
    });
    newAggregation.push({
      $unwind: {
        path: '$parentId',
        preserveNullAndEmptyArrays: true,
      },
    });
    return this.aggregateWithStrictSearch(newAggregation, searchText?.trim(), {
      page,
      limit,
    });
  }

  async assignAgent(params = {}, userId) {
    const {
      clientId,
      agent: agentId,
    } = params;
    const customer = await this.findById(clientId);
    const agent = await UserService.findById(agentId);
    if (customer?.agent?.toString() !== agentId?.toString()) {
      SendEvent(
        EVENT_TYPES.EVENT_LOG,
        LOG_TYPES.ASSIGN_AGENT,
        {
          customerId: clientId,
          userId,
          triggeredBy: 1,
          userLog: true,
          level: LOG_LEVELS.INFO,
          details: {},
          content: {
            name: `${customer.firstName} ${customer.lastName}`,
            agent: `${agent.firstName} ${agent.lastName}`,
          },
        },
      );
      SendEvent(
        EVENT_TYPES.PUSH_NOTIFICATION,
        {
          pushNotificationType: PUSH_NOTIFICATION_GROUPS.USERS.CLIENT_ASSIGNED,
          pushNotificationGroup: Object.keys(PUSH_NOTIFICATION_GROUPS).find((key) => key === 'USERS'),
          from: userId,
          fromModel: 'users',
          to: [agentId],
        },
        {
          client: {
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.email,
            recordId: customer.recordId,
            _id: customer._id.toString(),
          },
          agent: {
            _id: agent._id.toString(),
            firstName: agent.firstName,
            lastName: agent.lastName,
            email: agent.email,
            recordId: agent.recordId,
          },
        },
      );
    }
    return this.updateById(clientId, { agent });
  }

  async endAllSessions(customerId) {
    redis.deleteUserTokens(customerId.toString());
    return true;
  }

  async getDefaultConfigs(customerId) {
    const customerData = await super.findById(customerId, {
      markupId: 1,
      transactionFeeId: 1,
      tradingFeeId: 1,
    }, true, [{
      path: 'markupId',
      select: 'value title markets isPercentage',
    }, {
      path: 'transactionFeeId',
      select: 'value assets title isPercentage mixValue maxValue',
    }, {
      path: 'tradingFeeId',
      select: 'value markets title isPercentage mixValue maxValue',
    }]);
    let tradingFeeGroup = customerData.tradingFeeId;
    let transactionFeeGroup = customerData.transactionFeeId;
    let markupGroup = customerData.markupId;
    if (!markupGroup) {
      markupGroup = await markupService.findOne({ isDefault: true }, {
        value: 1,
        title: 1,
        markets: 1,
        isPercentage: 1,
      });
    }
    if (!tradingFeeGroup) {
      tradingFeeGroup = await feeGroupService.findOne({ isDefault: true }, {
        value: 1,
        mixValue: 1,
        maxValue: 1,
        isPercentage: 1,
        title: 1,
        markets: 1,
      });
    }
    if (!transactionFeeGroup) {
      transactionFeeGroup = await transactionFeeGroupService.findOne({ isDefault: true }, {
        value: 1,
        mixValue: 1,
        maxValue: 1,
        isPercentage: 1,
        title: 1,
        assets: 1,
      });
    }
    return {
      markupGroup,
      transactionFeeGroup,
      tradingFeeGroup,
    };
  }

  async updateCallStatus(leadId, params = {}) {
    const {
      callStatus,
      updatedBy,
    } = params;
    const customer = await this.findById(leadId, {}, true, [{
      path: 'agent',
      select: 'firstName lastName email memberTeamId',
      populate: [{
        path: 'memberTeamId',
        select: 'managerId title email',
      }],
    }]);
    const oldCallStatus = customer.callStatus;
    if (oldCallStatus !== callStatus) {
      SendEvent(
        EVENT_TYPES.EVENT_LOG,
        LOG_TYPES.CHANGE_CALL_STATUS,
        {
          customerId: leadId,
          userId: updatedBy,
          triggeredBy: 1,
          userLog: true,
          level: LOG_LEVELS.INFO,
          details: {},
          content: {
            name: `${customer.firstName} ${customer.lastName}`,
            oldCallStatus,
            newCallStatus: callStatus,
          },
        },
      );
      SendEvent(
        EVENT_TYPES.PUSH_NOTIFICATION,
        {
          pushNotificationType: PUSH_NOTIFICATION_GROUPS.USERS.CLIENT_STATUS_CHANGED,
          pushNotificationGroup: Object.keys(PUSH_NOTIFICATION_GROUPS).find((key) => key === 'USERS'),
          from: updatedBy,
          fromModel: 'users',
          to: [customer?.agent?._id?.toString()],
        },
        {
          client: {
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.email,
            recordId: customer.recordId,
            _id: customer._id.toString(),
          },
          data: {
            oldCallStatus,
            newCallStatus: callStatus,
          },
        },
      );
      return this.updateById(leadId, { callStatus });
    }
    throw new Error(`Lead stage is already ${callStatus}}`);
  }

  async updateCustomerSettings(id, params = {}, details = {}) {
    const {
      cp = false,
    } = details;
    const cust = await this.findById(id);
    const oldData = {};
    Object.keys(params).forEach((key) => {
      oldData[key] = cust[key];
    });
    if (cp) {
      SendEvent(
        EVENT_TYPES.EVENT_LOG,
        LOG_TYPES.SETTINGS_UPDATED,
        {
          customerId: id,
          userId: params.updatedBy,
          triggeredBy: 0,
          userLog: false,
          level: LOG_LEVELS.INFO,
          details: {},
          content: {
            newData: params,
            oldData,
          },
        },
      );
    } else {
      SendEvent(
        EVENT_TYPES.EVENT_LOG,
        LOG_TYPES.EDIT_CUSTOMER_INFO,
        {
          customerId: id,
          userId: params.updatedBy,
          triggeredBy: 1,
          userLog: true,
          level: LOG_LEVELS.INFO,
          details: {},
          content: {
            newData: params,
            oldData,
          },
        },
      );
    }
    params.updatedBy = undefined;
    const update = {};
    Object.keys(params.settings).forEach((key) => {
      update[`settings.${key}`] = params.settings[key];
    });
    return this.updateById(id, update);
  }

  async updateCustomerInfo(id, params = {}, details = {}) {
    const {
      cp = false,
      submit = false,
      avatar = false,
      corporatePersonnel = false,
    } = details;
    const cust = await this.findById(id);
    let push = {};
    if (cp) {
      SendEvent(
        EVENT_TYPES.EVENT_LOG,
        avatar ? LOG_TYPES.AVATAR_UPDATED : LOG_TYPES.PROFILE_COMPLETED,
        {
          customerId: id,
          userId: params.updatedBy,
          triggeredBy: 0,
          userLog: false,
          level: LOG_LEVELS.INFO,
          details: {},
          content: params,
        },
      );
      if (submit) {
        params = {
          ...params,
          'stages.individual.submitProfile': true,
          'stages.ib.submitProfile': true,
        }; // update stage field in he db for submit-profile
        if (params.declarations) {
          push = {
            declarations: params.declarations,
          };
          delete params.declarations;
        }
      }
    } else {
      const oldData = {};
      Object.keys(params).forEach((key) => {
        oldData[key] = cust[key];
      });
      SendEvent(
        EVENT_TYPES.EVENT_LOG,
        LOG_TYPES.EDIT_CUSTOMER_INFO,
        {
          customerId: id,
          userId: params.updatedBy,
          triggeredBy: 1,
          userLog: true,
          level: LOG_LEVELS.INFO,
          details: {},
          content: {
            newData: params,
            oldData,
          },
        },
      );
    }
    params.updatedBy = undefined;
    if (avatar) {
      const {
        profileAvatar,
      } = params;
      const blob = await fileHandler.uploadFile(
        profileAvatar.buffer,
        profileAvatar.mimetype,
        profileAvatar.originalname,
        `${id}/avatar`,
        false,
        false,
        true,
      );
      logger.info(['avatar blob', blob]);
      params.profileAvatar = blob.url;
    }
    if (corporatePersonnel) {
      const { corporateInfo: { directors, shareholders } } = params;
      delete params.corporateInfo;
      if (shareholders) return this.updateById(id, { 'corporateInfo.shareholders': shareholders });
      if (directors) return this.updateById(id, { 'corporateInfo.directors': directors });
    }
    return this.updateById(id, params, { push });
  }

  async getLeadsByCallStatus(agentQuery = {}, extraQuery = {}) {
    const {
      callStatus = CALL_STATUS.NEW,
      limit = 5,
    } = extraQuery;
    // TODO: Optimize this query
    const query = {
      ...agentQuery,
      callStatus: {
        $in: callStatus.split(','),
      },
    };
    const agg = [
      {
        $match: {
          ...query,
          isLead: true,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          _id: 1,
          createdAt: 1,
          agent: 1,
          isLead: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
          phone: 1,
          mobile: 1,
          country: 1,
          category: 1,
          callStatus: 1,
        },
      }, {
        $lookup: {
          from: 'users',
          localField: 'agent',
          foreignField: '_id',
          as: 'agent',
          pipeline: [
            {
              $project: {
                firstName: 1,
                lastName: 1,
              },
            },
          ],
        },
      }, {
        $unwind: {
          path: '$agent',
          includeArrayIndex: 'a',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: null,
          ...getCallStatusGroup(callStatus.split(',')),
        },
      },
    ];
    const data = await this.aggregate(agg);
    const result = data[0] || {};
    const total = {};
    Object.keys(result).forEach((key) => {
      if (key !== '_id') {
        result[key].sort((a, b) => b?.createdAt - a?.createdAt);
        total[key] = result[key].length || 0;
        result[key] = result[key].slice(0, limit);
      } else {
        delete result[key];
      }
    });
    return {
      data: result,
      total,
    };
  }

  async verifyTwoFactorAuth(params) {
    const {
      token,
      email,
      ip,
      type = 'verify',
    } = params;
    const customer = await this.findOne({ email }, {}, { lean: false });
    if (!customer) {
      throw new Error('Invalid email');
    }
    let secret;
    if (type === 'enable') {
      secret = await redis.getKey(`${customer._id.toString()}:${email}:enable2FA`);
    } else {
      secret = customer.twoFactorSecret;
    }
    const verified = speakeasy.totp.verify({
      secret: secret.ascii,
      encoding: 'ascii',
      token,
    });
    if (!verified) {
      throw new Error('Invalid two factor authentication code');
    }
    switch (type) {
      case 'login':
        return this.generateLoginToken(customer, ip);
      case 'enable':
        if (customer.settings.twoFactorAuthEnabled) {
          throw new Error('2FA is already enabled');
        }
        SendEvent(
          EVENT_TYPES.EVENT_LOG,
          LOG_TYPES.ENABLE_2FA,
          {
            customerId: customer._id,
            userId: params.updatedBy,
            triggeredBy: params.updatedBy ? 1 : 0,
            userLog: false,
            level: LOG_LEVELS.INFO,
            details: {},
            content: {},
          },
        );
        systemEmailService.sendSystemEmail(
          CONSTANTS.EMAIL_ACTIONS.TWOFA_ENABLED,
          {
            to: email,
            lang: customer?.language,
          },
          {
            firstName: customer.firstName,
            lastName: customer.lastName,
          },
        );
        redis.getClient.del(`${customer._id.toString()}:${email}:enable2FA`);
        await this.updateById(customer._id, {
          settings: { twoFactorAuthEnabled: true },
          twoFactorSecret: secret,
        });
        return verified;
      case 'disable':
        if (!customer.settings.twoFactorAuthEnabled) {
          throw new Error('2FA is already disabled');
        }
        SendEvent(
          EVENT_TYPES.EVENT_LOG,
          LOG_TYPES.DISABLE_2FA,
          {
            customerId: customer._id,
            userId: params.updatedBy,
            triggeredBy: params.updatedBy ? 1 : 0,
            userLog: false,
            level: LOG_LEVELS.INFO,
            details: {},
            content: {},
          },
        );

        systemEmailService.sendSystemEmail(
          CONSTANTS.EMAIL_ACTIONS.TWOFA_DISABLED,
          {
            to: email,
            lang: customer?.language,
          },
          {
            firstName: customer.firstName,
            lastName: customer.lastName,
          },
        );
        await this.updateById(customer._id, {
          settings: { twoFactorAuthEnabled: false },
          twoFactorSecret: {},
        });
        return verified;
      default:
        return verified;
    }
  }

  async firstTime2FAVerification(params) {
    const { token, id } = params;
    const customer = await this.findOne({ _id: id }, {}, { lean: false });
    const verified = speakeasy.totp.verify({
      secret: customer.twoFactorSecret.ascii,
      encoding: 'ascii',
      token,
    });
    if (!verified) {
      throw new Error('invalid two factor authentication code');
    }
    return verified;
  }

  async generateQRCode(params) {
    const { email, category, _id } = params;
    const customer = await this.findById(_id, {}, { lean: true });
    const secret = speakeasy.generateSecret({
      name: `${twoFAClientName} / (${email})`,
    });
    if (!customer.settings.twoFactorAuthEnabled) {
      redis.setKey(`${customer._id.toString()}:${email}:enable2FA`, secret, keys.twoFactorAuthTokenTime.seconds);
    } else {
      throw new Error('Already enabled 2FA');
    }
    // if (!customer.settings.twoFactorAuthEnabled) {
    //   await this.updateById(_id, { twoFactorSecret: secret });
    // }
    const qrCodeData = await qrcode.toDataURL(secret.otpauth_url);
    if (!qrCodeData) {
      throw new Error('Cannot generate qr');
    }
    return qrCodeData;
  }

  async checkEmail(email) {
    const customer = await this.findOne({ email });
    if (customer) throw new Error('Email already registered');
    return true;
  }

  async addAccount(customerId, login, type = 'demo') {
    return this.Model.update({ _id: customerId }, {
      $push: {
        [`fx.${type}Acc`]: parseInt(login),
      },
    });
  }

  // ib functions

  async linkClient(customerId, body, userId) {
    const { parentId } = body;
    const parentData = await this.findById(mongoose.Types.ObjectId(parentId), {}, { lean: true });
    const customerData = await this.findById(
      mongoose.Types.ObjectId(customerId),
      {},
      {
        lean: true,
        populate: [
          {
            path: 'fx.agrementId',
            select: 'title',
          },
          {
            path: 'parentId',
            select: 'firstName lastName email',
          },
        ],
      },
    );
    if (!customerData?.fx?.isIb && (!body.agrementId || body.agrementId === null)) {
      throw new Error('Agreement is required for non IB clients');
    }
    const agData = ibagrementService.findOne({
      customerId: mongoose.Types.ObjectId(parentId),
      _id: mongoose.Types.ObjectId(body.agrementId),
    });
    let linkObj = {
      parentId,
      parentLinkTime: new Date(),
    };
    if (body.agrementId) {
      linkObj = {
        ...linkObj,
        'fx.agrementId': body.agrementId,
        'fx.agrementLinkTime': new Date(),
      };
    }
    const customer = await this.findOne({ _id: customerId }, {}, { lean: true });
    if (customer.parentId) throw new Error('Customer is already linked');
    SendEvent(
      EVENT_TYPES.PUSH_NOTIFICATION,
      {
        pushNotificationType: PUSH_NOTIFICATION_GROUPS.CLIENT.CLIENT_LINKED,
        pushNotificationGroup: Object.keys(PUSH_NOTIFICATION_GROUPS).find((key) => key === 'CLIENT'),
        to: [parentId],
      },
      {
        client: {
          firstName: customerData.firstName,
          lastName: customerData.lastName,
          email: customerData.email,
          recordId: customerData.recordId,
          _id: customerData._id.toString(),
        },
        oldParent: {
          firstName: customerData.parentId?.firstName || '',
          lastName: customerData.parentId?.lastName || '',
          email: customerData.parentId?.email || '',
        },
        newParent: {
          firstName: parentData.firstName,
          lastName: parentData.lastName,
          email: parentData.email,
        },
        oldAgreement: {
          title: customerData.fx.agrementId?.title || '',
        },
        newAgreement: {
          title: agData.title,
        },
      },
    );
    // Create log for master
    SendEvent(
      EVENT_TYPES.EVENT_LOG,
      LOG_TYPES.LINK_IB,
      {
        customerId: mongoose.Types.ObjectId(parentId),
        userId,
        triggeredBy: 1,
        userLog: true,
        level: LOG_LEVELS.INFO,
        details: {},
        content: {
          parentName: `${parentData.firstName} ${parentData.lastName}`,
          clientName: `${customerData.firstName} ${customerData.lastName}`,
        },
      },
    );
    // create log for client
    SendEvent(
      EVENT_TYPES.EVENT_LOG,
      LOG_TYPES.LINK_IB,
      {
        customerId,
        userId,
        triggeredBy: 1,
        userLog: true,
        level: LOG_LEVELS.INFO,
        details: {},
        content: {
          parentName: `${parentData.firstName} ${parentData.lastName}`,
          clientName: `${customerData.firstName} ${customerData.lastName}`,
        },
      },
    );

    return this.updateById(customerId, linkObj);
  }

  async unLinkIb(customerId, userId) {
    const customerData = await this.findById(
      mongoose.Types.ObjectId(customerId),
    );
    const parentData = await this.findById(
      mongoose.Types.ObjectId(customerData.parentId),
    );
    // Create log for master
    SendEvent(
      EVENT_TYPES.EVENT_LOG,
      LOG_TYPES.UNLINK_IB,
      {
        customerId: customerData.parentId,
        userId,
        triggeredBy: 1,
        userLog: true,
        level: LOG_LEVELS.INFO,
        details: {},
        content: {
          parentName: `${parentData.firstName} ${parentData.lastName}`,
          clientName: `${customerData.firstName} ${customerData.lastName}`,
        },
      },
    );
    // create log for client
    SendEvent(
      EVENT_TYPES.EVENT_LOG,
      LOG_TYPES.UNLINK_IB,
      {
        customerId,
        userId,
        triggeredBy: 1,
        userLog: true,
        level: LOG_LEVELS.INFO,
        details: {},
        content: {
          parentName: `${parentData.firstName} ${parentData.lastName}`,
          clientName: `${customerData.firstName} ${customerData.lastName}`,
        },
      },
    );
    return this.updateById(customerId, {
      parentId: null,
      'fx.agrementId': null,
    });
  }

  async unLinkClients(clientIds, userId) {
    const query = {
      _id: {
        $in: clientIds.map((id) => mongoose.Types.ObjectId(id)),
      },
    };
    clientIds.forEach(async (id) => {
      const customerData = await this.findById(
        mongoose.Types.ObjectId(id),
      );
      const parentData = await this.findById(
        mongoose.Types.ObjectId(customerData.parentId),
      );
      // Create log for master
      SendEvent(
        EVENT_TYPES.EVENT_LOG,
        LOG_TYPES.UNLINK_IB,
        {
          customerId: customerData.parentId,
          userId,
          triggeredBy: 1,
          userLog: true,
          level: LOG_LEVELS.INFO,
          details: {},
          content: {
            parentName: `${parentData.firstName} ${parentData.lastName}`,
            clientName: `${customerData.firstName} ${customerData.lastName}`,
          },
        },
      );
      // create log for client
      SendEvent(
        EVENT_TYPES.EVENT_LOG,
        LOG_TYPES.UNLINK_IB,
        {
          customerId: id,
          userId,
          triggeredBy: 1,
          userLog: true,
          level: LOG_LEVELS.INFO,
          details: {},
          content: {
            parentName: `${parentData.firstName} ${parentData.lastName}`,
            clientName: `${customerData.firstName} ${customerData.lastName}`,
          },
        },
      );
    });
    return this.updateMany(query, {
      parentId: null,
      'fx.agrementId': null,
    });
  }

  async getChilds(customerId, type, dateFrom = '01-01-2021', dateTo) {
    const query = {
      category: {
        $in: [CONSTANTS.CUSTOMER_CATEGORIES.FOREX, CONSTANTS.CUSTOMER_CATEGORIES.BOTH],
      },
      'fx.isDemo': type === 'demo',
      parentLinkTime: {
        $gt: new Date(dateFrom),
        $lte: dateTo ? new Date(dateTo) : new Date(),
      },
    };
    const agg = [
      {
        $match: {
          _id: mongoose.Types.ObjectId(customerId),
        },
      }, {
        $project: {
          firstName: 1, lastName: 1, email: 1, phone: 1,
        },
      }, {
        $graphLookup: {
          from: 'customers',
          startWith: '$_id',
          connectFromField: '_id',
          connectToField: 'parentId',
          as: 'childs',
          maxDepth: keys.ibLevelDefault - 1,
          depthField: 'level',
          restrictSearchWithMatch: query,
        },
      }, {
        $addFields: {
          childs: {
            $map:
            {
              input: '$childs',
              as: 'item',
              in: {
                firstName: '$$item.firstName',
                lastName: '$$item.lastName',
                email: '$$item.email',
                level: '$$item.level',
                phone: '$$item.phone',
                fx: '$$item.fx',
                parentId: '$$item.parentId',
                _id: '$$item._id',
              },
            },
          },
        },
      },
    ];
    return this.aggregate(agg);
  }

  async getIbParents(customerId) {
    const query = {
      category: {
        $in: [CONSTANTS.CUSTOMER_CATEGORIES.FOREX, CONSTANTS.CUSTOMER_CATEGORIES.BOTH],
      },
      'fx.isIb': true,
    };
    const agg = [
      {
        $match: {
          _id: mongoose.Types.ObjectId(customerId),
        },
      }, {
        $project: {
          firstName: 1, lastName: 1, email: 1, parentId: 1, recordId: 1,
        },
      }, {
        $graphLookup: {
          from: 'customers',
          startWith: '$parentId',
          connectFromField: 'parentId',
          connectToField: '_id',
          as: 'parents',
          maxDepth: keys.ibLevelDefault - 1,
          depthField: 'level',
          restrictSearchWithMatch: query,
        },
      }, {
        $addFields: {
          parents: {
            $map:
            {
              input: '$parents',
              as: 'item',
              in: {
                firstName: '$$item.firstName',
                lastName: '$$item.lastName',
                email: '$$item.email',
                recordId: '$$item.recordId',
                level: '$$item.level',
                fx: '$$item.fx',
                parentId: '$$item.parentId',
                _id: '$$item._id',
              },
            },
          },
        },
      },
    ];
    return this.aggregate(agg);
  }

  async getChildsCount(customerId, type) {
    const queryLive = {
      category: {
        $in: [CONSTANTS.CUSTOMER_CATEGORIES.FOREX, CONSTANTS.CUSTOMER_CATEGORIES.BOTH],
      },
      'fx.isDemo': false,
      $or: [{
        'fx.isClient': true,
      }, {
        'fx.isIb': true,
      }],
    };
    const queryDemo = {
      category: {
        $in: [CONSTANTS.CUSTOMER_CATEGORIES.FOREX, CONSTANTS.CUSTOMER_CATEGORIES.BOTH],
      },
      'fx.isDemo': true,
    };
    const agg = [
      {
        $match: {
          _id: mongoose.Types.ObjectId(customerId),
        },
      }, {
        $project: {
          firstName: 1, lastName: 1, email: 1,
        },
      }, {
        $graphLookup: {
          from: 'customers',
          startWith: '$_id',
          connectFromField: '_id',
          connectToField: 'parentId',
          as: 'live',
          maxDepth: keys.ibLevelDefault - 1,
          depthField: 'level',
          restrictSearchWithMatch: queryLive,
        },
      }, {
        $graphLookup: {
          from: 'customers',
          startWith: '$_id',
          connectFromField: '_id',
          connectToField: 'parentId',
          as: 'demo',
          maxDepth: keys.ibLevelDefault - 1,
          depthField: 'level',
          restrictSearchWithMatch: queryDemo,
        },
      }, {
        $project: {
          live: {
            $size: '$live',
          },
          demo: {
            $size: '$demo',
          },
        },
      },
    ];
    const rows = await this.aggregate(agg);
    return rows[0] || {};
  }

  async getClientLiveAccs(customerId, platform = 'MT5') {
    const query = {
      category: {
        $in: [CONSTANTS.CUSTOMER_CATEGORIES.FOREX, CONSTANTS.CUSTOMER_CATEGORIES.BOTH],
      },
      'fx.isDemo': false,
    };
    const agg = [
      {
        $match: {
          _id: mongoose.Types.ObjectId(customerId),
        },
      }, {
        $project: {
          firstName: 1,
          lastName: 1,
          email: 1,
        },
      }, {
        $graphLookup: {
          from: 'customers',
          startWith: '$_id',
          connectFromField: '_id',
          connectToField: 'parentId',
          as: 'childs',
          maxDepth: keys.ibLevelDefault - 1,
          depthField: 'level',
          restrictSearchWithMatch: query,
        },
      }, {
        $lookup: {
          from: 'tradingaccounts',
          let: {
            childs: '$childs',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $in: [
                        '$customerId', '$$childs._id',
                      ],
                    }, {
                      $in: [
                        '$type', [CONSTANTS.TRADING_ACCOUNT_TYPES.LIVE, CONSTANTS.TRADING_ACCOUNT_TYPES.IB],
                      ],
                    }, {
                      $eq: [
                        '$platform', platform,
                      ],
                    },
                  ],
                },
              },
            },
          ],
          as: 'accounts',
        },
      }, {
        $project: {
          accounts: {
            $map: {
              input: '$accounts',
              as: 'accounts',
              in: {
                login: '$$accounts.login',
                _id: '$$accounts._id',
                platform: '$$accounts.platform',
              },
            },
          },
        },
      },
    ];

    const rows = await this.aggregate(agg);
    return (rows[0] && rows[0].accounts) || [];
  }

  async getParents(customerId) {
    const agg = [
      {
        $match: {
          _id: mongoose.Types.ObjectId(customerId),
        },
      }, {
        $project: {
          firstName: 1, lastName: 1, email: 1, parentId: 1,
        },
      }, {
        $graphLookup: {
          from: 'customers',
          startWith: '$parentId',
          connectFromField: 'parentId',
          connectToField: '_id',
          as: 'parents',
          maxDepth: keys.ibLevelDefault - 1,
          depthField: 'level',
        },
      }, {
        $addFields: {
          parents: {
            $map:
            {
              input: '$parents',
              as: 'item',
              in: {
                firstName: '$$item.firstName',
                lastName: '$$item.lastName',
                email: '$$item.email',
                level: '$$item.level',
                fx: '$$item.fx',
                parentId: '$$item.parentId',
                _id: '$$item._id',
              },
            },
          },
        },
      },
    ];
    const parents = await this.aggregate(agg);
    return (parents[0] && parents[0].parents) || [];
  }

  async disableTwoFactorAuth(customerId) {
    const customer = await this.findOne({ _id: mongoose.Types.ObjectId(customerId) });
    if (!customer) throw new Error('Cannot find customer');
    if (!customer.settings.twoFactorAuthEnabled) {
      throw new Error('Two factor authentication already disabled');
    }
    const res = await this.updateById(customer._id, {
      settings: { twoFactorAuthEnabled: false },
      twoFactorSecret: {},
    });
    return res;
  }

  async attachParentWithAgrement(customerId, parentId, agrementId) {
    let dataToUpdate = {};
    if (parentId) {
      dataToUpdate = {
        ...dataToUpdate,
        parentId,
        parentLinkTime: new Date(),
      };
    }
    if (agrementId) {
      dataToUpdate = {
        ...dataToUpdate,
        'fx.agrementId': agrementId,
        'fx.agrementLinkTime': new Date(),
      };
    }
    return this.updateById(mongoose.Types.ObjectId(customerId), dataToUpdate);
  }

  async makeFxLive(customerId) {
    const res = await this.updateById(mongoose.Types.ObjectId(customerId), {
      'fx.isClient': true,
      'fx.isDemo': false,
      isLead: false,
    });
    return res;
  }

  async getCustomersByLogins(logins) {
    const customers = await accountService.getCustomersByLogins(logins);
    return customers;
  }

  async updateQuestionnaire(params) {
    const result = await this.updateById(params.customer._id,
      {
        'fx.ibQuestionnaire.haveSite': params.haveSite,
        'fx.ibQuestionnaire.refOther': params.reffer,
        'fx.ibQuestionnaire.expectedClients': parseInt(params.expectedClients),
        'fx.ibQuestionnaire.targetCountries': params.targetCountries,
        'fx.ibQuestionnaire.getClients': params.getClient,
      });
    return result;
  }

  async convertDemoToLive({
    isDemo, customerId, ip, userId,
  }) {
    if (!isDemo) {
      throw new Error('Customer is already a live one');
    }
    SendEvent(
      EVENT_TYPES.EVENT_LOG,
      LOG_TYPES.CONVERT_CUSTOMER,
      {
        customerId,
        userId,
        triggeredBy: userId ? 1 : 0,
        userLog: false,
        level: LOG_LEVELS.INFO,
        details: {
          from: CONSTANTS.ACCOUNT_TYPE.DEMO, to: CONSTANTS.ACCOUNT_TYPE.LIVE, ip,
        },
        content: {},
      },
    );
    return this.updateById(customerId, {
      isLead: false,
      'fx.isDemo': false,
      'fx.isClient': true,
      'fx.demoConvertTime': new Date(),
    });
  }

  async convertToIB({ customer, user }) {
    if (!customer.fx) {
      throw new Error('Client is not an fx');
    }
    if (customer.fx.isIb) {
      throw new Error('Client is already an ib');
    }
    if (!customer.stages.kycApproved) {
      throw new Error('Client kyc is not approved');
    }
    const accs = await accountService.createIbAccount({
      customer,
    });
    const createRequest = await requestsService.createIbRequest(customer._id, true);
    if (accs && createRequest) {
      SendEvent(
        EVENT_TYPES.EVENT_LOG,
        LOG_TYPES.CONVERT_CUSTOMER,
        {
          customerId: customer._id,
          userId: user._id,
          triggeredBy: user ? 1 : 0,
          userLog: false,
          level: LOG_LEVELS.INFO,
          details: {
            from: customer.category, to: CONSTANTS.CUSTOMER_TYPES.IB,
          },
          content: {},
        },
      );
      return {
        converted: true,
      };
    }
    return {
      converted: true,
    };
  }

  async updateStartTrading(params) {
    const { id } = params;
    const res = await this.updateById(mongoose.Types.ObjectId(id),
      { 'stages.startTrading': true });
    return res;
  }

  async countClientGroups() {
    const res = await this.aggregate(customersFacetPipeline);
    return res[0];
  }
}

async function customerWatcher() {
  const collection = mongoose.connection.db.collection('customers');
  const changeStream = collection.watch({ fullDocument: 'updateLookup' });
  changeStream.on('change', async (next) => {
    const {
      fullDocument, documentKey, operationType, updateDescription,
    } = next;
    if (operationType === 'insert') {
      const action = '';
      switch (fullDocument.isLead) {
        case true: // register live handled in register controller
          // action = EMAIL_ACTIONS.REGISTER_DEMO;
          break;
        default:
      }
      // systemEmailService.sendSystemEmail(action, {
      //   to: fullDocument.email,
      //   ...fullDocument,
      //   lang: fullDocument?.language,
      // });
    }
  });
}

dbConnectionUpCb(customerWatcher);
module.exports = new CustomerService(CustomerModel.Model, CustomerModel.Schema);

setTimeout(() => {
  const services = require('src/modules/services');
  feeGroupService = services.feeGroupService;
  transactionFeeGroupService = services.transactionFeeGroupService;
  markupService = services.markupService;
  systemEmailService = services.systemEmailService;
  agrementService = services.ibAgrementService;
  requestsService = services.requestsService;
  accountService = services.accountService;
}, 0);
