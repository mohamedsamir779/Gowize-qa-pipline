const Joi = require('joi');

const { basePagination } = require('src/common/handlers');

module.exports.listing = Joi.object({
  ...basePagination,
});

module.exports.getFeeGroup = Joi.object({
  id: Joi.string(),
});

module.exports.create = Joi.object({
  title: Joi.string().required(),
  isPercentage: Joi.boolean().required(),
  value: Joi.number().positive().required(),
  minValue: Joi.number().positive().required(),
  maxValue: Joi.number().positive().required(),
  markets: Joi.object().required(),
});

module.exports.update = Joi.object({
  title: Joi.string(),
  isPercentage: Joi.boolean(),
  value: Joi.number().positive(),
  minValue: Joi.number().positive(),
  maxValue: Joi.number().positive(),
  markets: Joi.object(),
});
