const Joi = require('joi');

module.exports.getRequest = Joi.object({
  id: Joi.string(),
});

module.exports.myFatoorahDepositCheckout = Joi.object({
  amount: Joi.number().required(),
  currency: Joi.string().required().valid('USD'),
  paymentMethod: Joi.string().required(),
  paymentMethodId: Joi.number().required()
});
