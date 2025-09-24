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

module.exports.getClientAccounts = Joi.object({
  type: Joi.string().valid('DEMO', 'LIVE').required(),
  customerId: Joi.string().required(),
});

module.exports.getAllClientsAccounts = Joi.object({
  type: Joi.string().valid('DEMO', 'LIVE').required(),
  customersId: Joi.string().required(),
});

module.exports.getPositions = Joi.object({
  ...basePagination,
  tradingAccountId: Joi.string().required(),
});

module.exports.getClientTransactions = Joi.object({
  ...basePagination,
  type: Joi.string().required().valid('DEPOSIT', 'WITHDRAW'),
  accountType: Joi.string().required().valid('LIVE', 'DEMO'),
  status: Joi.string().valid('APPROVED', 'REJECTED', 'PENDING'),
  dateFrom: Joi.date(),
  dateTo: Joi.date(),
});

module.exports.getAgreements = Joi.object({
  ...basePagination,
});

module.exports.getStatement = Joi.object({
  platform: Joi.string().required().valid('MT5', 'MT4','CTRADER'),
  ...basePagination,
  dateFrom: Joi.date(),
  dateTo: Joi.date(),
});

module.exports.getStDeals = Joi.object({
  platform: Joi.string().required().valid('MT5', 'MT4','CTRADER'),
  clientLogin: Joi.number().required(),
  entry: Joi.number().valid(0, 1),
  dateFrom: Joi.date(),
  dateTo: Joi.date(),
  ...basePagination,
});

module.exports.getSummary = Joi.object({
  platform: Joi.string().required().valid('MT5', 'MT4','CTRADER'),
});

module.exports.makeInternalTransfer = Joi.object({
  tradingAccountFrom: Joi.number().required(),
  tradingAccountTo: Joi.number().required(),
  amount: Joi.number().positive().required(),
  note: Joi.string().allow(''),
});
