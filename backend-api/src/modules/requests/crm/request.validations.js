const Joi = require('joi');
const { basePagination } = require('src/common/handlers');
const { CONSTANTS } = require('src/common/data');

module.exports.getRequest = Joi.object({
  id: Joi.string(),
});

module.exports.listing = Joi.object({
  ...basePagination,
  searchText: Joi.string(),
  status: Joi.string().valid(...(Object.keys(CONSTANTS.REQUESTS_STATUS))),
  filteredValues: Joi.object(),
});

module.exports.ibActions = Joi.object({
  requestId: Joi.string(),
});

module.exports.leverageActions = Joi.object({
  requestId: Joi.string(),
});

module.exports.accountAction = Joi.object({
  requestId: Joi.string().required(),
});
