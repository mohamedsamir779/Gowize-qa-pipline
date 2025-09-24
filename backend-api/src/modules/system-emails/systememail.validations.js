const Joi = require('joi');

const { basePagination } = require('src/common/handlers');

module.exports.listing = Joi.object({
  ...basePagination,
});

module.exports.getSystemEmail = Joi.object({
  id: Joi.string(),
});

module.exports.previewEmail = Joi.object({
  id: Joi.string(),
  lang: Joi.string(),
});

module.exports.create = Joi.object({
  title: Joi.string().required(),
  fields: Joi.array(),
  action: Joi.string(),
});

module.exports.createUserTemplate = Joi.object({
  title: Joi.string().required(),
  content: Joi.object().required(),
  fields: Joi.array(),
});

module.exports.update = Joi.object({
  title: Joi.string().allow(''),
  fields: Joi.array(),
  action: Joi.string(),
  isActive: Joi.boolean(),
});

module.exports.updateContent = Joi.object({
  language: Joi.string().required(),
  subject: Joi.string().required(),
  body: Joi.string().required(),
});

module.exports.emailStatus = Joi.object({
  id: Joi.string(),
  status: Joi.string().valid('activate', 'deactivate').required(),
});
