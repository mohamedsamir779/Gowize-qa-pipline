const Joi = require('joi');

module.exports.addUtmCampaign = Joi.object({
  name: Joi.string().required(),
  user: Joi.string().allow(null, ''),
  domain: Joi.string().allow(null, ''),
  type: Joi.string().required(),
  urlType: Joi.string().required(),
  url: Joi.string().required(),
  source: Joi.string().required(),
  section: Joi.string().required(),
});

module.exports.editUtmCampaign = Joi.object({
  name: Joi.string().required(),
  user: Joi.string().allow(null, ''),
  domain: Joi.string().allow(null, ''),
  type: Joi.string().required(),
  urlType: Joi.string().required(),
  url: Joi.string().required(),
  source: Joi.string().required(),
  section: Joi.string().required(),
  campaignToken: Joi.string().required(),
});
