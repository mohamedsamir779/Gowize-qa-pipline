const Joi = require('joi');
const { basePagination } = require('src/common/handlers');

module.exports.listing = Joi.object({
  ...basePagination,
  customerId: Joi.string(),
  exchange: Joi.string(),
});

module.exports.balances = Joi.object({
  exchange: Joi.string(),
  type: Joi.string().valid('free', 'used', 'total'),
  asset: Joi.string(),
});
