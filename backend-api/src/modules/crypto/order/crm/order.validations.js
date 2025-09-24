const Joi = require('joi');
const { basePagination } = require('src/common/handlers');

module.exports.listing = Joi.object({
  ...basePagination,
  customerId: Joi.string(),
});

module.exports.UDOrder = Joi.object({
  id: Joi.string(),
});

module.exports.create = Joi.object({
  symbol: Joi.string().required(),
  type: Joi.string().required(),
  side: Joi.string().required(),
  amount: Joi.string().required(),
  tp: Joi.string().allow(''),
  sl: Joi.string().allow(''),
  price: Joi.when('type', {
    is: 'market',
    then: Joi.number().allow(null),
    otherwise: Joi.number().required(),
  }),
  customerId: Joi.string().allow(''),
});

module.exports.update = Joi.object({
});
