/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
const moment = require('moment');
const mongoose = require('mongoose');
const crypto = require('crypto');
const Joi = require('joi');

const { keys } = require('../data');
const { logger } = require('../lib');

const { emitter } = require('./events/emitter');
const { CONSTANTS } = require('../data');
const { PUSH_NOTIFICATION_GROUPS } = require('../data/constants');
const { enableDecryptPassword } = require('../data/keys');

const getPrefixofModel = (modeName = '') => {
  const split = modeName.split('-');
  if (split.length > 1) {
    return split[0][0] + split[1][0];
  }

  return modeName.substring(0, 2);
};

const RoundDate = (date, duration, method) => moment(Math[method](+date / +duration) * +duration);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports.encryptPassword = (password, allowDecrypt = true) => {
  if (enableDecryptPassword && allowDecrypt) {
    const cipher = crypto.createCipheriv(
      keys.algorithm,
      Buffer.from(keys.securityKey, 'hex'),
      Buffer.from(keys.initVector, 'hex'),
    );
    let encrypted = cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }
  const iterations = 100;
  const keylen = 24;

  const derivedKey = crypto.pbkdf2Sync(
    password,
    keys.passwordSalt,
    iterations,
    keylen,
    'sha512',
  );
  const pw = Buffer.from(derivedKey, 'binary').toString('hex');
  return pw;
};

module.exports.comparePassword = (password, hash) => {
  const newPassword = this.encryptPassword(password);
  if (hash === newPassword) return true;
  return false;
};

module.exports.decryptPassword = (encrypted) => {
  try {
    const decipher = crypto.createDecipheriv(
      keys.algorithm,
      Buffer.from(keys.securityKey, 'hex'),
      Buffer.from(keys.initVector, 'hex'),
    );
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.log('error in decrypting password', error);
    return '';
  }
};

module.exports.ApiResponse = (res, status, resObj, result) => res.status(resObj.code || 200).json({
  status,
  message:
    resObj.message,
  result,
  isSuccess: status,
});

module.exports.generateRandomImageName = () => {
  const _sym = 'abcdefghijklmnopqrstuvwxyz1234567890';
  let str = '';

  for (let i = 0; i < 40; i++) {
    str += _sym[parseInt(Math.random() * (_sym.length), 10)];
  }
  return `${str}.png`;
};

module.exports.generatePassword = (len = 8) => {
  // starts with two characters then numbers
  let pass = '';
  const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  // for (let i = 0; i < 2; i++) {
  //   const char = Math.floor(Math.random()
  //     * str.length);
  //   pass += str.charAt(char);
  // }
  // for (let i = 0; i < len - 2; i++) {
  //   pass += Math.floor(Math.random() * 10);
  // }
  // password must contain at least one number, one lowercase, one uppercase letter and one special character
  const specialChars = '!@#$%&()_+{}:<>?|[];,.';
  const numbers = '0123456789';
  const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
  const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  // const allChars = `${specialChars}${numbers}${lowerCase}${upperCase}`;
  // for (let i = 0; i < len; i++) {
  //   const char = Math.floor(Math.random()
  //     * allChars.length);
  //   pass += allChars.charAt(char);
  // }
  // make sure password contains at least one of each required character
  const requiredChars = [specialChars, numbers, lowerCase, upperCase];
  for (let i = 0; i < requiredChars.length; i++) {
    const char = Math.floor(Math.random()
      * requiredChars[i].length);
    pass += requiredChars[i].charAt(char);
  }
  // fill in remaining with random characters from allChars
  const remainingChars = len - pass.length;
  for (let i = 0; i < remainingChars; i++) {
    const char = Math.floor(Math.random()
      * str.length);
    pass += str.charAt(char);
  }
  // shuffle password
  pass = pass.split('').sort(() => 0.5 - Math.random()).join('');
  return pass;
};

module.exports.stringArrToUri = (arr) => {
  try {
    let tmpStr = arr.join(' ');
    tmpStr = tmpStr.split(/\s+/).join(' ');
    return tmpStr.split(' ').join('-');
  } catch (error) {
    logger.log('err ', error);
    return '';
  }
};

module.exports.generateReferenceForModel = (len, modelName) => {
  const prefix = getPrefixofModel(modelName);
  let initialValue1 = '1';
  let initialValue2 = '9';
  for (let index = 1; index < len - 2; index++) {
    initialValue1 += '0';
    initialValue2 += '0';
  }
  return `${prefix.toUpperCase()}${Math.floor(parseInt(initialValue1, 10) + Math.random() * parseInt(initialValue2, 10))}`;
};

// const parseJoiObject = (validationObject) => {
//   if (!validationObject || !validationObject._inner || !validationObject._inner.children) return [];
//   const keysArr = [];
//   const entries = validationObject._inner.children.entries();
//   function logMapElements(value) {
//     keysArr.push({
//       key: value.key,
//       type: value.schema._type,
//       valids: value.schema._valids ? Array.from(value.schema._valids._set) : null, // for now only to make it work
//       flags: value.schema._flags,
//     });
//   }
//   new Map(entries)
//     .forEach(logMapElements);
//   return keysArr;
// };

module.exports.parseJoiObject = (validationObject) => {
  // const keysArr = [];
  // const entries = (validationObject && validationObject._inner.children && validationObject._inner.children.entries()) || [];
  // function logMapElements(value) {
  //   keysArr.push({
  //     key: value.key,
  //     type: (value.schema._inner && value.schema._inner.items) ? parseJoiObject(value.schema._inner.items[0]) : value.schema._type,
  //     valids: value.schema._valids ? Array.from(value.schema._valids._set) : null, // for now only to make it work
  //     flags: value.schema._flags,
  //   });
  // }
  // new Map(entries)
  //   .forEach(logMapElements);
  // return keysArr;
  const keysArr = [];
  const entries = validationObject && validationObject._ids._byKey.entries();
  function logMapElements(value, key) {
    keysArr.push({
      key,
      type: value.schema.type,
      valids: value.schema._valids ? Array.from(value.schema._valids._values) : null,
      flags: value.schema._flags,
    });
  }
  new Map(entries)
    .forEach(logMapElements);
  return keysArr;
};

module.exports.getMarketSymbolFromAssets = (baseAsset, quoteAsset) => (`${baseAsset}/${quoteAsset}`);
module.exports.getAssetsFromMarketSymbol = (symbol) => {
  const assets = symbol.split('/');
  return {
    baseAsset: assets[0],
    quoteAsset: assets[1],
  };
};
module.exports.removeMarketDivider = (marketSymbol, divider = '/', join = '') => marketSymbol.split(divider).join(join);
module.exports.RoundDate = RoundDate;
module.exports.sleep = sleep;
module.exports.getFromToMSFromSince = (since, timeFrame, limit) => {
  const fromDateTime = typeof since.getMonth === 'function' ? new Date(since) : new Date(parseInt(since, 10));
  const unit = timeFrame[timeFrame.length - 1];
  const time = parseInt(timeFrame.slice(0, timeFrame.indexOf(unit)), 10);
  const toDateTime = new Date(moment(fromDateTime).valueOf() + (limit * moment.duration(time, unit).valueOf()));
  const fromMS = RoundDate(
    fromDateTime,
    moment.duration(time, unit),
    'floor',
  ).valueOf();
  const toMS = RoundDate(
    toDateTime,
    moment.duration(time, unit),
    'floor',
  ).valueOf();
  return {
    fromMS,
    toMS,
    time,
    unit,
  };
};

module.exports.formatKline = (data, fromBase = true) => {
  if (fromBase) {
    return {
      time: data.t,
      open: data.o,
      high: data.h,
      low: data.l,
      close: data.c,
      volume: data.v,
      symbol: data.s,
    };
  }
  return {
    t: data.time,
    o: data.open,
    h: data.high,
    l: data.low,
    c: data.close,
    v: data.volume,
    s: data.symbol,
  };
};

module.exports.getDataFromTimespan = (timespan = '24h') => {
  let timeframe; let limit;
  const unit = timespan[timespan.length - 1];
  const time = parseInt(timespan.slice(0, timespan.indexOf(unit)), 10);
  const duration = moment.duration(time, unit);
  const since = new Date(moment().subtract(duration).valueOf());
  switch (timespan) {
    case '24h':
      timeframe = '30m';
      limit = 48;
      break;
    case '7d':
      timeframe = '4h';
      limit = 42;
      break;
    case '30d':
      timeframe = '12h';
      limit = 60;
      break;
    default:
      timeframe = '30m';
      limit = 48;
  }
  return {
    since,
    timeframe,
    limit,
  };
};

module.exports.getHighChartsKey = (ts, s) => (`base_high_${ts}_${s}`);

module.exports.dbConnectionUpCb = async (cb) => {
  if (!process.env.MONGO_URI || process.env.MONGO_URI.includes('localhost')) {
    logger.warn('MONGO_URI not set or localhost, skipping db connection check');
    return false;
  }
  try {
    const interval = setInterval(() => {
      if (mongoose.connection.readyState === 1) {
        cb(true);
        clearInterval(interval);
      }
    }, 1000);
    return await mongoose.connection.readyState === 1;
  } catch (err) {
    return false;
  }
};

module.exports.SendEvent = (eventType, type, data, demo = false) => (
  emitter.emit(eventType, {
    type,
    data,
    demo,
  })
);

// eslint-disable-next-line max-len
module.exports.generateUuid = () => Math.random().toString() + Math.random().toString() + Math.random().toString();

module.exports.basePagination = {
  page: Joi.number(),
  limit: Joi.number(),
  searchText: Joi.string(),
};

module.exports.createPagination = (total, page, limit) => {
  page = parseInt(page, 10) || 1;
  const totalsCount = parseInt(total, 10) || 0;
  const totalPages = parseInt(Math.ceil(totalsCount / limit), 10);
  return {
    page,
    limit,
    totalDocs: totalsCount,
    totalPages,

    hasNextPage: totalPages > page,
    hasPrevPage: page > 1,
    nextPage: totalPages > page ? page + 1 : null,
    pagingCounter: page,
    prevPage: page > 1 ? page - 1 : null,
  };
};

module.exports.addCustomerPortals = (customer, req) => {
  if (customer && req) {
    req.customerType = customer.customerType;
    req.isCryptoDemo = (customer.crypto && customer.crypto.isDemo) || false;
    req.isCryptoClient = (customer.crypto && customer.crypto.isClient) || false;
    req.isFxClient = (customer.fx && customer.fx.isClient) || false;
    req.isFxDemo = (customer.fx && customer.fx.isDemo) || false;
    req.isFxIb = (customer.fx && customer.fx.isIb) || false;
    req.isFxIbDemo = (customer.fx && customer.fx.isIbDemo) || false;
    req.isGold = (customer.gold && customer.gold.isClient) || false;
    req.isMM = (customer.moneyManagement && customer.moneyManagement.isClient) || false;
  }
};

module.exports.reshapeAgrement = (parentId, accountTypeId, agrement) => {
  let members;
  if (agrement.members.length === 1) {
    members = agrement.members;
  } else {
    const linkedIb = agrement.members.find((obj) => obj.customerId.toString() === parentId.toString());
    members = agrement.members.filter((obj) => obj.level <= linkedIb.level);
  }
  members = members.map((obj) => ({
    ...obj,
    values: obj.values.find(
      (valueItem) => valueItem.accountTypeId.toString() === accountTypeId.toString(),
    ),
  }));
  return members;
};

module.exports.sleep = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

module.exports.generateRandomPin = (len) => {
  let initialValue1 = '1';
  let initialValue2 = '9';
  for (let index = 1; index < len - 2; index++) {
    initialValue1 += '0';
    initialValue2 += '0';
  }
  return Math.floor(parseInt(initialValue1, 10) + Math.random() * parseInt(initialValue2, 10));
};

module.exports.addAgentToQuery = (user, query = {}) => {
  if (user) {
    if (!user.showAll) {
      if (!user.showTeamsOnly) {
        query = {
          ...query,
          agent: {
            $in: [mongoose.Types.ObjectId(user._id)],
          },
        };
      } else {
        query = {
          ...query,
          agent: {
            $in: user.teamMembers.map((obj) => mongoose.Types.ObjectId(obj)),
          },
        };
      }
    }
  }
  return query;
};

module.exports.addAgentForUserList = (user, query = {}) => {
  if (user) {
    if (!user.showAll) {
      if (!user.showTeamsOnly) {
        query = {
          ...query,
          _id: {
            $eq: user._id,
          },
        };
      } else {
        query = {
          ...query,
          _id: {
            $in: user.teamMembers,
          },
        };
      }
    }
  }
  return query;
};

module.exports.checkCustomerType = (customer, type) => {
  if (customer && customer.customerType) {
    return customer.customerType;
  }
  return 'client';
};

module.exports.getCustomerCategory = (customer) => {
  const category = [];
  if (customer.fx) {
    if (customer.fx.isClient || customer.fx.isIb || customer.fx.isDemo) {
      category.push(CONSTANTS.CUSTOMER_CATEGORIES.FOREX);
    }
  }
  if (customer.crypto) {
    if (customer.crypto.isClient || customer.crypto.isIb || customer.crypto.isDemo) {
      category.push(CONSTANTS.CUSTOMER_CATEGORIES.CRYPTO);
    }
  }
  if (customer.gold) {
    if (customer.gold.isClient) {
      category.push(CONSTANTS.CUSTOMER_CATEGORIES.GOLD);
    }
  }
  if (customer.mm) {
    if (customer.mm.isClient) {
      category.push(CONSTANTS.CUSTOMER_CATEGORIES.MM);
    }
  }
  return category;
};

module.exports.getCurrencyForGateway = (currencyRate, requiredGateway) => (currencyRate.gateways
  ? currencyRate.gateways[requiredGateway]
    ? currencyRate.gateways[requiredGateway]
    : currencyRate.value
  : currencyRate.value
);

module.exports.getPushNotificationData = (pushNotificationType, pushNotificationData) => {
  let title = '';
  let body = '';
  const icon = keys.clientLogo || '';
  let data = {};
  // eslint-disable-next-line default-case
  switch (pushNotificationType) {
    case PUSH_NOTIFICATION_GROUPS.TRANSACTION.DEPOSIT__PENDING:
    case PUSH_NOTIFICATION_GROUPS.TRANSACTION.DEPOSIT__APPROVED:
    case PUSH_NOTIFICATION_GROUPS.TRANSACTION.DEPOSIT__REJECTED:
      title = `Client Deposit (${pushNotificationData.transaction.recordId}) - ${pushNotificationData.transaction.status}`;
      body = `The deposit (${pushNotificationData.transaction.recordId}) to account, ${pushNotificationData.transaction.login} (${pushNotificationData.transaction.amount} ${pushNotificationData.transaction.currency}) for the client ${pushNotificationData.client.firstName} ${pushNotificationData.client.lastName} is ${pushNotificationData.transaction.status}`;
      data = {
        cpClickUrl: '/accounts/live',
        crmClickUrl: `/transactions/deposit?status=${pushNotificationData.transaction.status}}`,
        extraParams: {
          ...pushNotificationData,
        },
      };
      break;
    case PUSH_NOTIFICATION_GROUPS.TRANSACTION.WITHDRAWAL__PENDING:
    case PUSH_NOTIFICATION_GROUPS.TRANSACTION.WITHDRAWAL__APPROVED:
    case PUSH_NOTIFICATION_GROUPS.TRANSACTION.WITHDRAWAL__REJECTED:
      title = `Client Withdrawal (${pushNotificationData.transaction.recordId}) - ${pushNotificationData.transaction.status}`;
      body = `The withdrawal (${pushNotificationData.transaction.recordId}) to account, ${pushNotificationData.transaction.login} (${pushNotificationData.transaction.amount} ${pushNotificationData.transaction.currency}) for the client ${pushNotificationData.client.firstName} ${pushNotificationData.client.lastName} is ${pushNotificationData.transaction.status}`;
      data = {
        cpClickUrl: '/accounts/live',
        crmClickUrl: `/transactions/withdrawals?status=${pushNotificationData.transaction.status}}`,
        extraParams: {
          ...pushNotificationData,
        },
      };
      break;
    case PUSH_NOTIFICATION_GROUPS.TRANSACTION.INTERNAL_TRANSFER__PENDING:
    case PUSH_NOTIFICATION_GROUPS.TRANSACTION.INTERNAL_TRANSFER__APPROVED:
    case PUSH_NOTIFICATION_GROUPS.TRANSACTION.INTERNAL_TRANSFER__REJECTED:
      title = `Client Internal-Transfer (${pushNotificationData.transaction.recordId}) - ${pushNotificationData.transaction.status}`;
      body = `The internal transfer (${pushNotificationData.transaction.recordId}) to account, ${pushNotificationData.transaction.login} (${pushNotificationData.transaction.amount} ${pushNotificationData.transaction.currency}) for the client ${pushNotificationData.client.firstName} ${pushNotificationData.client.lastName} is ${pushNotificationData.transaction.status}`;
      data = {
        cpClickUrl: '/accounts/live',
        crmClickUrl: `/transactions/internal-transfer?status=${pushNotificationData.transaction.status}}`,
        extraParams: {
          ...pushNotificationData,
        },
      };
      break;
    case PUSH_NOTIFICATION_GROUPS.TRANSACTION.CREDIT__PENDING:
    case PUSH_NOTIFICATION_GROUPS.TRANSACTION.CREDIT__APPROVED:
    case PUSH_NOTIFICATION_GROUPS.TRANSACTION.CREDIT__REJECTED:
      title = `Client Credit (${pushNotificationData.transaction.recordId}) - ${pushNotificationData.transaction.status}`;
      body = `The Credit (${pushNotificationData.transaction.recordId}) to account, ${pushNotificationData.transaction.login} (${pushNotificationData.transaction.amount} ${pushNotificationData.transaction.currency}) for the client ${pushNotificationData.client.firstName} ${pushNotificationData.client.lastName} is ${pushNotificationData.transaction.status}`;
      data = {
        cpClickUrl: '/accounts/live',
        crmClickUrl: `/transactions/credit?status=${pushNotificationData.transaction.status}}`,
        extraParams: {
          ...pushNotificationData,
        },
      };
      break;
    case PUSH_NOTIFICATION_GROUPS.TRANSACTION.WALLET_DEPOSIT__APPROVED:
    case PUSH_NOTIFICATION_GROUPS.TRANSACTION.WALLET_DEPOSIT__PENDING:
    case PUSH_NOTIFICATION_GROUPS.TRANSACTION.WALLET_DEPOSIT__REJECTED:
      title = `Client Deposit (${pushNotificationData.transaction.recordId}) - ${pushNotificationData.transaction.status}`;
      body = `The Deposit (${pushNotificationData.transaction.recordId}) to wallet, ${pushNotificationData.transaction.currency} (${pushNotificationData.transaction.amount} ${pushNotificationData.transaction.currency}) for the client ${pushNotificationData.client.firstName} ${pushNotificationData.client.lastName} is ${pushNotificationData.transaction.status}`;
      data = {
        cpClickUrl: '/wallet',
        crmClickUrl: `/transactions/deposit?status=${pushNotificationData.transaction.status}}`,
        extraParams: {
          ...pushNotificationData,
        },
      };
      break;
    case PUSH_NOTIFICATION_GROUPS.TRANSACTION.WALLET_WITHDRAWAL__APPROVED:
    case PUSH_NOTIFICATION_GROUPS.TRANSACTION.WALLET_WITHDRAWAL__PENDING:
    case PUSH_NOTIFICATION_GROUPS.TRANSACTION.WALLET_WITHDRAWAL__REJECTED:
      title = `Client WITHDRAW (${pushNotificationData.transaction.recordId}) - ${pushNotificationData.transaction.status}`;
      body = `The Withdraw (${pushNotificationData.transaction.recordId}) to wallet, ${pushNotificationData.transaction.currency} (${pushNotificationData.transaction.amount} ${pushNotificationData.transaction.currency}) for the client ${pushNotificationData.client.firstName} ${pushNotificationData.client.lastName} is ${pushNotificationData.transaction.status}`;
      data = {
        cpClickUrl: '/wallet',
        crmClickUrl: `/transactions/withdrawals?status=${pushNotificationData.transaction.status}}`,
        extraParams: {
          ...pushNotificationData,
        },
      };
      break;
    case PUSH_NOTIFICATION_GROUPS.TRANSACTION.WALLET_INTERNAL_TRANSFER__APPROVED:
    case PUSH_NOTIFICATION_GROUPS.TRANSACTION.WALLET_INTERNAL_TRANSFER__PENDING:
    case PUSH_NOTIFICATION_GROUPS.TRANSACTION.WALLET_INTERNAL_TRANSFER__REJECTED:
      title = `Client Internal Transfer (${pushNotificationData.transaction.recordId}) - ${pushNotificationData.transaction.status}`;
      body = `The Internal Transfer (${pushNotificationData.transaction.recordId}), from (${pushNotificationData.transaction.from}) to (${pushNotificationData.transaction.to})  (${pushNotificationData.transaction.amount}) for the client ${pushNotificationData.client.firstName} ${pushNotificationData.client.lastName} is ${pushNotificationData.transaction.status}`;
      data = {
        cpClickUrl: '/wallet',
        crmClickUrl: `/transactions/internal-transfer?status=${pushNotificationData.transaction.status}}`,
        extraParams: {
          ...pushNotificationData,
        },
      };
      break;
    case PUSH_NOTIFICATION_GROUPS.KYC.KYC__PENDING:
    case PUSH_NOTIFICATION_GROUPS.KYC.KYC__APPROVED:
    case PUSH_NOTIFICATION_GROUPS.KYC.KYC__REJECTED:
    case PUSH_NOTIFICATION_GROUPS.KYC.KYC__EXPIRED:
    case PUSH_NOTIFICATION_GROUPS.KYC.KYC__UPLOADED:
      title = `KYC (${pushNotificationData.kyc.type}) document, ${pushNotificationData.kyc.status}`;
      body = `The KYC (${pushNotificationData.kyc.type}) of ${pushNotificationData.client.firstName} ${pushNotificationData.client.lastName} has been ${pushNotificationData.kyc.status} ${pushNotificationData.kyc.rejectionReason ? `due to: ${pushNotificationData.kyc.rejectionReason}` : ''}`;
      data = {
        cpClickUrl: '/documents',
        crmClickUrl: `/kyc?recordId=${pushNotificationData.recordId}`,
        extraParams: {
          ...pushNotificationData,
        },
      };
      break;
    case PUSH_NOTIFICATION_GROUPS.REQUEST.ACCOUNT_REQUEST__PENDING:
    case PUSH_NOTIFICATION_GROUPS.REQUEST.ACCOUNT_REQUEST__APPROVED:
    case PUSH_NOTIFICATION_GROUPS.REQUEST.ACCOUNT_REQUEST__REJECTED:
      title = `Account Request (${pushNotificationData.request.recordId}) ${pushNotificationData.request.status}`;
      body = `An account request (${pushNotificationData.request.recordId}) by ${pushNotificationData.client.firstName} ${pushNotificationData.client.lastName} for account type ${pushNotificationData.request.accountType} is ${pushNotificationData.request.status}`;
      data = {
        cpClickUrl: '/accounts/live',
        crmClickUrl: `/account-requests?recordId=${pushNotificationData.recordId}`,
        extraParams: {
          ...pushNotificationData,
        },
      };
      break;
    case PUSH_NOTIFICATION_GROUPS.REQUEST.IB_REQUEST__PENDING:
    case PUSH_NOTIFICATION_GROUPS.REQUEST.IB_REQUEST__APPROVED:
    case PUSH_NOTIFICATION_GROUPS.REQUEST.IB_REQUEST__REJECTED:
      title = `IB Request (${pushNotificationData.request.recordId}) ${pushNotificationData.request.status}`;
      body = `The IB request (${pushNotificationData.request.recordId}) by ${pushNotificationData.client.firstName} ${pushNotificationData.client.lastName} has been ${pushNotificationData.request.status}`;
      data = {
        cpClickUrl: '/request-partnership',
        crmClickUrl: `/ib-requests?recordId=${pushNotificationData.recordId}`,
        extraParams: {
          ...pushNotificationData,
        },
      };
      break;
    case PUSH_NOTIFICATION_GROUPS.REQUEST.LEVERAGE_REQUEST__PENDING:
    case PUSH_NOTIFICATION_GROUPS.REQUEST.LEVERAGE_REQUEST__APPROVED:
    case PUSH_NOTIFICATION_GROUPS.REQUEST.LEVERAGE_REQUEST__REJECTED:
      title = `Leverage Change Request (${pushNotificationData.request.recordId}) ${pushNotificationData.request.status}`;
      body = `Leverage Change request (${pushNotificationData.request.recordId}) by ${pushNotificationData.client.firstName} ${pushNotificationData.client.lastName} from ${pushNotificationData.request.from} -> ${pushNotificationData.request.to} for account ${pushNotificationData.request.login} has been ${pushNotificationData.request.status}`;
      data = {
        cpClickUrl: '/accounts/live',
        crmClickUrl: `/ib-requests?recordId=${pushNotificationData.recordId}`,
        extraParams: {
          ...pushNotificationData,
        },
      };
      break;
    case PUSH_NOTIFICATION_GROUPS.SECURITY.TWOFA_DISABLED:
    case PUSH_NOTIFICATION_GROUPS.SECURITY.TWOFA_ENABLED:
      break;
    case PUSH_NOTIFICATION_GROUPS.SECURITY.PASSWORD_CHANGED:
      break;
    case PUSH_NOTIFICATION_GROUPS.SECURITY.PASSWORD_RESET_REQUESTED:
      break;
    case PUSH_NOTIFICATION_GROUPS.SECURITY.PASSWORD_RESET:
      break;
    case PUSH_NOTIFICATION_GROUPS.CLIENT.CLIENT_REGISTERED:
      title = 'Client Registered via dedicated link';
      body = `The client ${pushNotificationData?.client?.firstName || ''} ${pushNotificationData?.client?.lastName || ''} registered via dedicated link and assigned to agreement ${pushNotificationData?.agreement?.title || '-'}`;
      data = {
        cpClickUrl: `/clients/${pushNotificationData?.client?._id}/profile`,
        extraParams: {
          ...pushNotificationData,
        },
      };
      break;
    case PUSH_NOTIFICATION_GROUPS.CLIENT.CLIENT_LINKED:
      title = 'Client Linked under you';
      body = `The client ${pushNotificationData?.client?.firstName || ''} ${pushNotificationData?.client?.lastName || ''} has been linked under you and assigned to agreement ${pushNotificationData?.agreement?.title || '-'}`;
      data = {
        cpClickUrl: `/clients/${pushNotificationData?.client?._id}/profile`,
        extraParams: {
          ...pushNotificationData,
        },
      };
      break;
    case PUSH_NOTIFICATION_GROUPS.CLIENT.LINKED_DEPOSITS:
      break;
    case PUSH_NOTIFICATION_GROUPS.CLIENT.NEW_AGREEMENT:
      break;
    case PUSH_NOTIFICATION_GROUPS.USERS.CLIENT_ASSIGNED:
      title = `Client Assigned (${pushNotificationData?.client?.recordId || '-'})`;
      body = `The client ${pushNotificationData?.client?.firstName || ''} ${pushNotificationData?.client?.lastName || ''} has been assigned to you`;
      data = {
        crmClickUrl: `/clients/${pushNotificationData?.client?._id}/profile`,
        extraParams: {
          ...pushNotificationData,
        },
      };
      break;
    case PUSH_NOTIFICATION_GROUPS.USERS.CLIENT_REGISTERED:
      title = `Client Registered (${pushNotificationData.client.recordId || '-'})`;
      body = `The client ${pushNotificationData?.client?.firstName || ''} ${pushNotificationData?.client?.lastName || ''} has registered with your dedicated link`;
      data = {
        crmClickUrl: `/clients/${pushNotificationData?.client?._id}/profile`,
        extraParams: {
          ...pushNotificationData,
        },
      };
      break;
    case PUSH_NOTIFICATION_GROUPS.USERS.CLIENT_REMARK:
      title = `${pushNotificationData?.admin?.firstName || ''} ${pushNotificationData?.admin?.lastName || ''} added a remark for Client, ${pushNotificationData?.client?.firstName || ''} ${pushNotificationData?.client?.lastName || ''}`;
      body = pushNotificationData?.remark?.note || '';
      data = {
        crmClickUrl: `/clients/${pushNotificationData?.client?._id}/notes`,
        extraParams: {
          ...pushNotificationData,
        },
      };
      break;
    case PUSH_NOTIFICATION_GROUPS.USERS.CLIENT_STATUS_CHANGED:
      title = `Call status updated for, ${pushNotificationData?.client?.firstName || ''} ${pushNotificationData?.client?.lastName || ''}`;
      body = `The call status has been updated from ${pushNotificationData?.data?.oldCallStatus || '-'} -> ${pushNotificationData?.data?.newCallStatus || '-'}`;
      data = {
        crmClickUrl: `/clients/${pushNotificationData?.client?._id}/profile`,
        extraParams: {
          ...pushNotificationData,
        },
      };
      break;
    case PUSH_NOTIFICATION_GROUPS.USERS.USER_REMINDER:
      title = 'Calendar Reminder';
      body = pushNotificationData?.note || '';
      data = {
        crmClickUrl: '/calendar',
        extraParams: {
          ...pushNotificationData,
        },
      };
      break;
    case PUSH_NOTIFICATION_GROUPS.TRADING_ACCOUNT.TRADING_ACCOUNT_CREATED:
      break;
    case PUSH_NOTIFICATION_GROUPS.TRADING_ACCOUNT.TRADING_ACCOUNT_STATUS_CHANGED:
      break;
    case PUSH_NOTIFICATION_GROUPS.TRADING_ACCOUNT.TRADING_ACCOUNT_TYPE_CHANGED:
      break;
    case PUSH_NOTIFICATION_GROUPS.TRADING_ACCOUNT.TRADING_ACCOUNT_LINKED:
      break;
    case PUSH_NOTIFICATION_GROUPS.TRADING_ACCOUNT.TRADING_ACCOUNT_UNLINKED:
      break;
    case PUSH_NOTIFICATION_GROUPS.TRADING_ACCOUNT.TRADING_ACCOUNT_MASTER_PASSWORD_CHANGED:
      break;
    case PUSH_NOTIFICATION_GROUPS.TRADING_ACCOUNT.TRADING_ACCOUNT_INVESTOR_PASSWORD_CHANGED:
      break;
  }
  return {
    title,
    body,
    data,
    icon,
  };
};
