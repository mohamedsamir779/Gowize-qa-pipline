const Joi = require('joi');
const { CONSTANTS } = require('src/common/data');
const { basePagination } = require('src/common/handlers');

module.exports.listing = Joi.object({
  ...basePagination,
  customerId: Joi.string(),
  currency: Joi.string(),
  status: Joi.string(),
  gateway: Joi.string(),
  toDate: Joi.date(),
  fromDate: Joi.date(),
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
  amount: Joi.number().positive().required(),
  note: Joi.string().allow(''),
  paymentPayload: Joi.any().allow(),
  'paymentPayload.walletAddress': Joi.alternatives().conditional('gateway', [
    { is: 'CRYPTO', then: Joi.string().required() },
  ]),
  'paymentPayload.transactionHash': Joi.alternatives().conditional('gateway', [
    { is: 'CRYPTO', then: Joi.string().required() },
  ]),
  'paymentPayload.coin': Joi.alternatives().conditional('gateway', [
    { is: 'CRYPTO', then: Joi.string().required() },
  ]),
  'paymentPayload.network': Joi.alternatives().conditional('gateway', [
    { is: 'CRYPTO', then: Joi.string().required() },
  ]),
});

module.exports.withdrawBasic = Joi.object({
  // type: CONSTANTS.TRANSACTIONS_TYPES.WITHDRAW,
  gateway: Joi.string().required()
    .allow(...Object.keys(CONSTANTS.TRANSACTIONS_GATEWAYS)),
  walletId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  note: Joi.string().allow(''),
  payload: Joi.allow(),
  name: Joi.allow(''),
  address: Joi.allow(''),
  phone: Joi.allow(''),
});

module.exports.withdrawCrypto = Joi.object({
  to: Joi.string().required(),
  walletId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  note: Joi.string().allow(''),
  assetId: Joi.string().required(),
  addressId: Joi.string().required(),
  chainId: Joi.string().required(),
  networkName: Joi.string().required(),
  cryptoapiName: Joi.string().required(),
  from: Joi.string().required(),
});

module.exports.update = Joi.object({
  id: Joi.string(),
});

module.exports.transfer = Joi.object({
  amount: Joi.number().required(),
  baseCurrency: Joi.string().required(),
  targetCurrency: Joi.string().required(),
  source: Joi.string().required(),
  destination: Joi.string().required(),
  note: Joi.string().allow(''),
  fromId: Joi.string().required(),
  toId: Joi.string().required(),
});
