const Joi = require('joi');
const { basePagination } = require('src/common/handlers');
const { CONSTANTS } = require('src/common/data');

module.exports.getRequest = Joi.object({
  id: Joi.string(),
});

module.exports.createChangeLeverageRequest = Joi.object({
  to: Joi.number().required(),
  from: Joi.number(),
  login: Joi.number().required(),
  platform: Joi.string().required(),
  _id: Joi.string(),
});

module.exports.createAccountRequest = Joi.object({
  accountTypeId: Joi.string().required(),
  leverage: Joi.string().allow(''),
  currency: Joi.string().required(),
  reason: Joi.string().required(),
});
