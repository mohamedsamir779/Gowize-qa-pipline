const Joi = require('joi');

module.exports.getRequest = Joi.object({
  id: Joi.string(),
});

module.exports.jccDepositCheckout = Joi.object({
  amount: Joi.number().required(),
  currency: Joi.string().required().valid('USD'),
});
