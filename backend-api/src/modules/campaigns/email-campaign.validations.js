const Joi = require('joi');

const { basePagination } = require('src/common/handlers');

module.exports.listing = Joi.object({
  ...basePagination,
});

module.exports.create = Joi.object({
  name: Joi.string().required(),
  templateId: Joi.string().required(),
  language: Joi.string().required(),
  groups: Joi.array().required(),
  scheduleDate: Joi.date().required(),
  fromEmail: Joi.string().required(),
  replyTo: Joi.string().required(),
  jobId: Joi.string(),
});

module.exports.getEmailCampaign = Joi.object({
  id: Joi.string(),
});
