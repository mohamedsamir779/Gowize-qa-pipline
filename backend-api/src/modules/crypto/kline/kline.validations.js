const Joi = require('joi');

module.exports.getKline = Joi.object({
  since: Joi.string().required(),
  limit: Joi.number().max(1000).required(),
  symbol: Joi.string().required(),
  timeframe: Joi.string().required(),
});

module.exports.getAllKline = Joi.object({
  timespan: Joi.string().required().valid('24h', '7d', '30d'),
});
