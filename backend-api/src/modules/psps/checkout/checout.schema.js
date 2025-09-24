const Joi = require('joi');

exports.checkoutSchema = Joi.object({
    amount: Joi.number()
    .precision(2) // allow up to 2 decimal places
    .positive()   // optional: ensures it's greater than 0
    .required(),
  currency: Joi.string().length(3).required(), // example: 'USD'
  description: Joi.string().required(),
  email: Joi.string().email().required(),
  number: Joi.string().required(), // order number
  walletId: Joi.string(),
  fees:Joi.number(),
  tradingAccountId: Joi.string(), 
}).required()