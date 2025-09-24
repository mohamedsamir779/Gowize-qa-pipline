const Joi = require('joi');

const { basePagination } = require('src/common/handlers');

module.exports.listing = Joi.object({
  ...basePagination,
});

module.exports.create = Joi.object({
  title: Joi.string().required(),
  subject: Joi.string().required(),
  content: Joi.object().required(),
  fields: Joi.array(),
});

module.exports.getCampaignTemplate = Joi.object({
  id: Joi.string(),
});

module.exports.previewEmail = Joi.object({
  id: Joi.string(),
  lang: Joi.string(),
});

module.exports.update = Joi.object({
  title: Joi.string().allow(''),
  fields: Joi.array(),
  content: Joi.object().required(),
});
