const Joi = require('joi');

const { basePagination } = require('src/common/handlers');

module.exports.getCustomer = Joi.object({
  customerId: Joi.string(),
});

module.exports.getClients = Joi.object({
  type: Joi.string().valid('demo', 'live').required(),
  dateFrom: Joi.date(),
  dateTo: Joi.date(),
});

module.exports.getClient = Joi.object({
  clientId: Joi.string(),
});

module.exports.getStatement = Joi.object({
  customerId: Joi.string().required(),
  platform: Joi.string().required().valid('MT5', 'MT4','CTRADER'),
  ...basePagination,
  dateFrom: Joi.date(),
  dateTo: Joi.date(),
});

module.exports.getStDeals = Joi.object({
  customerId: Joi.string().required(),
  platform: Joi.string().required().valid('MT5', 'MT4','CTRADER'),
  clientLogin: Joi.number().required(),
  ...basePagination,
  dateFrom: Joi.date(),
  dateTo: Joi.date(),
  entry: Joi.number().valid(0, 1),
});

module.exports.linkClient = Joi.object({
  parentId: Joi.string().required(),
  agrementId: Joi.string(),
});

module.exports.makeInternalTransfer = Joi.object({
  tradingAccountFrom: Joi.number().required(),
  tradingAccountTo: Joi.number().required(),
  amount: Joi.number().positive().required(),
  note: Joi.string().allow(''),
});
