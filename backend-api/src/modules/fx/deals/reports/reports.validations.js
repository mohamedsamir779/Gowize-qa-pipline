const Joi = require('joi');
const { CONSTANTS } = require('src/common/data');
const { basePagination } = require('src/common/handlers');


module.exports.updateAgreementPath = Joi.object({
  id: Joi.string().required(),
});
