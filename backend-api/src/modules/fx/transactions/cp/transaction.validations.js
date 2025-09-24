const Joi = require('joi');
const { CONSTANTS } = require('src/common/data');
const { basePagination } = require('src/common/handlers');

module.exports.listing = Joi.object({
  tradingAccountId: Joi.string().allow(''),
  accountType: Joi.string(),
  type: Joi.string().allow(...Object.keys(CONSTANTS.TRANSACTIONS_TYPES)),
  dateFrom: Joi.date(),
  dateTo: Joi.date(),
  ...basePagination,
});

module.exports.clientTransListing = Joi.object({
  ...basePagination,
  type: Joi.string().allow(''),
  deposits: Joi.string().allow(''),
  withdraws: Joi.string().allow(''),
  internalTransfers: Joi.string().allow(''),
});

module.exports.deposit = Joi.object({
  // type: CONSTANTS.TRANSACTIONS_TYPES.DEPOSIT,
  gateway: Joi.string().required()
    .allow(...Object.keys(CONSTANTS.TRANSACTIONS_GATEWAYS)),
  tradingAccountId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  currency: Joi.string().allow(''),
  note: Joi.string().allow(''),
  'paymentPayload.walletAddress': Joi.alternatives().conditional('gateway', [
    { is: 'CRYPTO', then: Joi.string().required() },
    { is: 'WIRE_TRANSFER', then: Joi.any() },
  ]),
  'paymentPayload.transactionHash': Joi.alternatives().conditional('gateway', [
    { is: 'CRYPTO', then: Joi.string().required() },
    { is: 'WIRE_TRANSFER', then: Joi.any() },
  ]),
  'paymentPayload.coin': Joi.alternatives().conditional('gateway', [
    { is: 'CRYPTO', then: Joi.string().required() },
    { is: 'WIRE_TRANSFER', then: Joi.any() },
  ]),
  'paymentPayload.network': Joi.alternatives().conditional('gateway', [
    { is: 'CRYPTO', then: Joi.string().required() },
    { is: 'WIRE_TRANSFER', then: Joi.any() },
  ]),
  paymentPayload: Joi.allow(),
});

module.exports.withdrawl = Joi.object({
  // type: CONSTANTS.TRANSACTIONS_TYPES.WITHDRAW,
  gateway: Joi.string().required()
    .allow(...Object.keys(CONSTANTS.TRANSACTIONS_GATEWAYS)),
  tradingAccountId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  note: Joi.string().allow(''),
  name: Joi.allow(''),
  address: Joi.allow(''),
  phone: Joi.allow(''),
  'payload.walletAddress': Joi.alternatives().conditional('gateway', [
    { is: 'CRYPTO', then: Joi.string().required() },
    { is: 'WIRE_TRANSFER', then: Joi.any() },
  ]),
  'payload.address': Joi.alternatives().conditional('gateway', [
    { is: 'CRYPTO', then: Joi.string().required() },
    { is: 'WIRE_TRANSFER', then: Joi.any() },
  ]),
  'payload.coin': Joi.alternatives().conditional('gateway', [
    { is: 'CRYPTO', then: Joi.string().required() },
    { is: 'WIRE_TRANSFER', then: Joi.any() },
  ]),
  'payload.network': Joi.alternatives().conditional('gateway', [
    { is: 'CRYPTO', then: Joi.string().required() },
    { is: 'WIRE_TRANSFER', then: Joi.any() },
  ]),
  payload: Joi.allow(),
});

module.exports.internalTransferRequest = Joi.object({
  tradingAccountFrom: Joi.string().required(),
  tradingAccountTo: Joi.string().required(),
  amount: Joi.number().positive().required(),
  note: Joi.string().allow(''),
});

module.exports.internalTransfer = Joi.object({
  tradingAccountFrom: Joi.string().required(),
  tradingAccountTo: Joi.string().required(),
  amount: Joi.number().positive().required(),
  note: Joi.string().allow(''),
});

module.exports.credit = Joi.object({
  type: Joi.string().required().valid('CREDIT_IN', 'CREDIT_OUT'),
  tradingAccountId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  note: Joi.string().allow(''),
});
