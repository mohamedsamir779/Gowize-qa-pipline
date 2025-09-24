const Joi = require('joi');
const { CONSTANTS } = require('src/common/data');
const { basePagination } = require('src/common/handlers');

module.exports.listing = Joi.object({
  ...basePagination,
  customerId: Joi.string(),
  type: Joi.string(),
  searchText: Joi.string(),
  filteredValues: Joi.object(),
});

module.exports.create = Joi.object({
  type: Joi.string().required().allow(...Object.keys(CONSTANTS.TRANSACTIONS_TYPES)),
  transactionGateway: Joi.string().required()
    .allow(...Object.keys(CONSTANTS.TRANSACTIONS_GATEWAYS)),
  // customerId: Joi.string().required(),
  content: Joi.any(),
  amount: Joi.number().required(),
  // currency: Joi.string().required(),
  tradingAccountId: Joi.string(),
  tradingAccountFromId: Joi.string(),
  tradingAccountToId: Joi.string(),
});

module.exports.depositBasic = Joi.object({
  // type: CONSTANTS.TRANSACTIONS_TYPES.DEPOSIT,
  gateway: Joi.string().required()
    .allow(...Object.keys(CONSTANTS.TRANSACTIONS_GATEWAYS)),
  walletId: Joi.string().required(),
  customerId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  note: Joi.string().allow(''),
  type: Joi.string(),
});

module.exports.withdrawBasic = Joi.object({
  // type: CONSTANTS.TRANSACTIONS_TYPES.WITHDRAW,
  gateway: Joi.string().required()
    .allow(...Object.keys(CONSTANTS.TRANSACTIONS_GATEWAYS)),
  walletId: Joi.string().required(),
  customerId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  note: Joi.string().allow(''),
});

module.exports.withdrawCrypto = Joi.object({
  // type: CONSTANTS.TRANSACTIONS_TYPES.WITHDRAW,
  walletId: Joi.string().required(),
  customerId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  to: Joi.string().required(),
  note: Joi.string().allow(''),
});

module.exports.update = Joi.object({
  id: Joi.string(),
});
