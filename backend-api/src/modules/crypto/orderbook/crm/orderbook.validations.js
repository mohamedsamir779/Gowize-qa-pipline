const Joi = require('joi');
const { basePagination } = require('src/common/handlers');

module.exports.listing = Joi.object({
  ...basePagination,
  pairName: Joi.string().allow(''),
  marketId: Joi.string().allow(''),
  exchange: Joi.string().allow(''),
  markupId: Joi.string().allow(''),
});
