const Joi = require('joi');

module.exports.getConversionRate = Joi.object({
  baseCurrency: Joi.string(),
  targetCurrency: Joi.string(),
});

module.exports.getConversionValue = Joi.object({
  baseCurrency: Joi.string(),
  targetCurrency: Joi.string(),
  amount: Joi.number(),
});

module.exports.create = Joi.object({
  baseCurrency: Joi.string().required(),
  targetCurrency: Joi.string().required(),
  value: Joi.string().required(),
});

module.exports.idPath = Joi.object({
  id: Joi.string().required(),
});

module.exports.update = Joi.object({
  value: Joi.string().required(),
  targetCurrency: Joi.string().required(),
  baseCurrency: Joi.string().required(),
});
