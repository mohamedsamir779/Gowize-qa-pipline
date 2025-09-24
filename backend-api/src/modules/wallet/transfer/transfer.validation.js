const Joi = require('joi');

module.exports.request = Joi.object({
  fromId: Joi.string().required(),
  toId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  note: Joi.string().allow(''),
  baseCurrency: Joi.string().required(),
  targetCurrency: Joi.string().required(),
  source: Joi.string().required(), // Wallet, TradingAccount,
  destination: Joi.string().required(), // Wallet, TradingAccount,
});
