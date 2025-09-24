const Joi = require('joi');
const { basePagination } = require('src/common/handlers');
const { CONSTANTS } = require('src/common/data');

module.exports.getRequest = Joi.object({
  id: Joi.string(),
});

module.exports.mastercardDepositCheckout = Joi.object({
  amount: Joi.number().required(),
  currency: Joi.string().required().valid('USD'),
});
