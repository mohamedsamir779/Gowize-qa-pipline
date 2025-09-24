const Joi = require('joi');

module.exports.registerDemo = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),

  country: Joi.string().required(),
  nationality: Joi.string(),
  city: Joi.string(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  dob: Joi.string(),
  gender: Joi.string(),
  // address: Joi.string(),

  password: Joi.string().required(),
  declarations: Joi.array().items(Joi.string()),
  parentRef: Joi.string(),
  agRef: Joi.string(),
  salesRef: Joi.string(),
  ibId: Joi.string(),
  ibRef: Joi.string(),
  emailPin: Joi.number().required(),
  utmCampaign: Joi.string().allow(null, ''),
  ref: Joi.string().allow(null, ''),
  // ibid: Joi.string(),
});

module.exports.registerLive = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),

  country: Joi.string().required(),
  nationality: Joi.string(),
  city: Joi.string(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  dob: Joi.string(),
  gender: Joi.string(),
  // address: Joi.string(),

  password: Joi.string().required(),
  declarations: Joi.array().items(Joi.string()),
  // ibid: Joi.string(),
  parentRef: Joi.string(),
  agRef: Joi.string(),
  ibId: Joi.string(),
  ibRef: Joi.string(),
  salesRef: Joi.string(),
  emailPin: Joi.number().required(),
  utmCampaign: Joi.string().allow(null, ''),
  ref: Joi.string().allow(null, ''),
});

module.exports.registerCorporate = Joi.object({
  firstName: Joi.string().required(),
  country: Joi.string().required(),
  nationality: Joi.string(),
  city: Joi.string(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  password: Joi.string().required(),
  declarations: Joi.array().items(Joi.string()),
  parentRef: Joi.string(),
  agRef: Joi.string(),
  salesRef: Joi.string(),
  emailPin: Joi.number().required(),
  isCorporate: Joi.boolean(),
});

module.exports.verifyPin = Joi.object({
  email: Joi.string().required(),
  emailPin: Joi.number().required(),
});

module.exports.emailPin = Joi.object({
  email: Joi.string().required(),
});
