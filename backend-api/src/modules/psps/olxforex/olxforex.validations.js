const Joi = require('joi');

module.exports.olxforexDepositCheckout = Joi.object({
  amount: Joi.number().required(),
  walletId: Joi.string().required(),
  note: Joi.string().allow(''),
  gateway: Joi.string().required().valid('OLX_FOREX'),
});
