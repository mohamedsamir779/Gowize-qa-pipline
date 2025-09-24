const Joi = require('joi');
const { basePagination } = require('src/common/handlers');

module.exports.listing = Joi.object({
  ...basePagination,
  customerId: Joi.string(),
  type: Joi.string(),
  level: Joi.number(),
  userLog: Joi.boolean(),
});
