const Joi = require('joi');
const { basePagination } = require('src/common/handlers');

module.exports.listing = Joi.object({
  ...basePagination,
});

module.exports.create = Joi.object({
  name: Joi.string().required(),
  baseAsset: Joi.string().required(),
  quoteAsset: Joi.string().required(),
  active: Joi.boolean().allow(null),
  fee: Joi.number().required(),
  minAmount: Joi.number().required(),
});

module.exports.update = Joi.object({
  name: Joi.string().required(),
  active: Joi.boolean().allow(null),
  fee: Joi.number().required(),
  minAmount: Joi.number().required(),
});

module.exports.marketStatus = Joi.object({
  id: Joi.string(),
  status: Joi.string().valid('activate', 'deactivate').required(),
});
