const Joi = require('joi');

const { basePagination } = require('src/common/handlers');
const { CONSTANTS } = require('../../../../common/data');

module.exports.listing = Joi.object({
  ...basePagination,
  customerId: Joi.string(),
  login: Joi.number().allow(''),
  logins: Joi.any(),
});

module.exports.accountTypeListing = Joi.object({
  type: Joi.string().valid(...Object.keys(CONSTANTS.TRADING_ACCOUNT_TYPES)),
  forCrm: Joi.boolean(),
  ...basePagination,
});

module.exports.createAccountType = Joi.object({
  title: Joi.string().required(),
  platform: Joi.string().required(),
  type: Joi.string().valid(...Object.keys(CONSTANTS.TRADING_ACCOUNT_TYPES)),
  leverages: Joi.array().items(Joi.number()),
  defaultLeverage: Joi.number().required(),
  sequence: Joi.number().required(),
  currencies: Joi.array().items(Joi.object({
    currency: Joi.string().required(),
    groupPath: Joi.string().required(),
  })),
  minWithdrawal: Joi.number().required(),
  minDeposit: Joi.number().required(),
  forCp: Joi.boolean(),
  forCrm: Joi.boolean(),
});

module.exports.updateAccountType = Joi.object({
  title: Joi.string(),
  platform: Joi.string(),
  type: Joi.string().valid(...Object.keys(CONSTANTS.TRADING_ACCOUNT_TYPES)),
  leverages: Joi.array().items(Joi.number()),
  defaultLeverage: Joi.number(),
  sequence: Joi.number(),
  minWithdrawal: Joi.number(),
  minDeposit: Joi.number(),
  currencies: Joi.array().items(Joi.object({
    currency: Joi.string(),
    groupPath: Joi.string(),
  })),
  forCp: Joi.boolean(),
  forCrm: Joi.boolean(),
});

module.exports.getAccount = Joi.object({
  id: Joi.string(),
});

module.exports.getAccountByLogin = Joi.object({
  login: Joi.number().allow(''),
});

module.exports.getAccountByCustomerId = Joi.object({
  customerId: Joi.string(),
});

module.exports.create = Joi.object({
  accountTypeId: Joi.string().required(),
  leverage: Joi.string().allow(''),
  customerId: Joi.string().required(),
  currency: Joi.string().required(),
});

module.exports.update = Joi.object({
  accountTypeId: Joi.string().allow(''),
  leverage: Joi.string().allow(''),
});

module.exports.changeLeverage = Joi.object({
  leverage: Joi.number().required().min(1).max(1000),
});

module.exports.changePassword = Joi.object({
  login: Joi.number().required(),
  type: Joi.string().required(),
});

module.exports.changeGroup = Joi.object({
  login: Joi.number().required(),
  accountTypeId: Joi.string().required(),
});

module.exports.changeAccess = Joi.object({
  login: Joi.number().required(),
  isActivating: Joi.boolean().required(),
});

module.exports.linkAccount = Joi.object({
  customerId: Joi.string().required(),
  accountTypeId: Joi.string().required(),
  login: Joi.number().required(),
  currency: Joi.string().required(),
  type: Joi.string().required(),
});
