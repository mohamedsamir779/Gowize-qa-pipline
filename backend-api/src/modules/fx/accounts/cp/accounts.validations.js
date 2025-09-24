const Joi = require('joi');

const { basePagination } = require('src/common/handlers');

module.exports.listing = Joi.object({
  ...basePagination,
  type: Joi.string().allow('', 'DEMO', 'LIVE'),
});

module.exports.accountTypeListing = Joi.object({
  forCp: Joi.boolean(),
  ...basePagination,
});

module.exports.getAccount = Joi.object({
  id: Joi.string(),
});

module.exports.create = Joi.object({
  accountTypeId: Joi.string().required(),
  leverage: Joi.string().allow(''),
  password: Joi.string().allow(''),
  currency: Joi.string().required(),
});

module.exports.changePassword = Joi.object({
  password: Joi.string().required(),
  type: Joi.string().valid('main', 'investor'),
});

module.exports.changeLeverage = Joi.object({
  leverage: Joi.number().required().min(100).max(1000),
});
