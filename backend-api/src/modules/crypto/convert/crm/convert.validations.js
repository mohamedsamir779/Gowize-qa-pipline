const Joi = require('joi');
const { basePagination } = require('src/common/handlers');

module.exports.listing = Joi.object({
  ...basePagination,
  customerId: Joi.string(),
});

module.exports.create = Joi.object({
  toAsset: Joi.string().required(),
  fromAsset: Joi.string().required(),
  fromAssetId: Joi.string().required(),
  toAssetId: Joi.string().required(),
  amount: Joi.string().required(),

});

module.exports.UDConvert = Joi.object({
  id: Joi.string(),
});

module.exports.previewConversion = Joi.object({
  from: Joi.string().required(),
  to: Joi.string().required(),
});
