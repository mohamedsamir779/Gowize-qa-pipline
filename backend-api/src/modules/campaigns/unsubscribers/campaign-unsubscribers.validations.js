const Joi = require('joi');

const { basePagination } = require('src/common/handlers');

module.exports.listing = Joi.object({
  ...basePagination,
});

module.exports.unsubscribe = Joi.object({
  email: Joi.string(),
});
