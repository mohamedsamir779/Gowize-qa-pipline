const Joi = require('joi');

module.exports.listing = Joi.object().keys({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).default(10),
  type: Joi.string().valid('all', 'deposit', 'withdrawal', 'transfer').default('all'),
  wallet: Joi.string().allow(''),
  dateFrom: Joi.date().allow(''),
  dateTo: Joi.date().allow(''),
});
