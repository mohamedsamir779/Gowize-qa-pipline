const Joi = require('joi');
const { basePagination } = require('src/common/handlers');

module.exports.listing = Joi.object({
  ...basePagination,
  belongsTo: Joi.string().allow(''),
  customerId: Joi.string(),
  isCrypto: Joi.boolean(),
});

module.exports.create = Joi.object({
  belongsTo: Joi.string().required(),
  symbol: Joi.string().required(),
});

module.exports.update = Joi.object({
  status: Joi.boolean().required(),
});

module.exports.getWallet = Joi.object({
  id: Joi.string(),
});
