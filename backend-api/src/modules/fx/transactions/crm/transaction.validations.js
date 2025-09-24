const Joi = require('joi');
const { CONSTANTS } = require('src/common/data');
const { basePagination } = require('src/common/handlers');

module.exports.listing = Joi.object({
  ...basePagination,
  customerId: Joi.string(),
  filteredValues: Joi.object(),
});

module.exports.clientTransListing = Joi.object({
  ...basePagination,
  customerId: Joi.string().required(),
  type: Joi.string().allow(''),
  deposits: Joi.string().allow(''),
  withdraws: Joi.string().allow(''),
  internalTransfers: Joi.string().allow(''),
});

module.exports.deposit = Joi.object({
  // type: CONSTANTS.TRANSACTIONS_TYPES.DEPOSIT,
  gateway: Joi.string().required()
    .allow(...Object.keys(CONSTANTS.TRANSACTIONS_GATEWAYS)),
  customerId: Joi.string().required(),
  tradingAccountId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  note: Joi.string().allow(''),
});

module.exports.withdrawl = Joi.object({
  // type: CONSTANTS.TRANSACTIONS_TYPES.WITHDRAW,
  gateway: Joi.string().required()
    .allow(...Object.keys(CONSTANTS.TRANSACTIONS_GATEWAYS)),
  customerId: Joi.string().required(),
  tradingAccountId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  note: Joi.string().allow(''),
});

module.exports.internalTransfer = Joi.object({
  customerId: Joi.string().required(),
  tradingAccountFrom: Joi.string().required(),
  tradingAccountTo: Joi.string().required(),
  amount: Joi.number().positive().required(),
  note: Joi.string().allow(''),
  type: Joi.string().required(),
  platform: Joi.string().required(),
});

module.exports.credit = Joi.object({
  type: Joi.string().required().valid('CREDIT_IN', 'CREDIT_OUT'),
  customerId: Joi.string().required(),
  tradingAccountId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  note: Joi.string().allow(''),
});

module.exports.update = Joi.object({
  id: Joi.string(),
});
