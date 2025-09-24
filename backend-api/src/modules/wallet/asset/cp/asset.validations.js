const Joi = require('joi');
const { basePagination } = require('./base-validations');

module.exports.listing = Joi.object({
  ...basePagination,
});

module.exports.getAsset = Joi.object({
  id: Joi.string().required(),
});

module.exports.create = Joi.object({
  name: Joi.string().required(),
  symbol: Joi.string().required(),
  description: Joi.string(),
  isCrypto: Joi.boolean().required(),
  links: Joi.array().items(Joi.string()).allow(null),
  markup: Joi.string().required(),
  fee: Joi.object({
    deposit: Joi.string().required().messages({ 'any.required': 'Please enter deposit fee amount' }),
    withdrawal: Joi.string().required().messages({ 'any.required': 'Please enter withdrawal fee amount' }),
  }),
  explorerLink: Joi.string().allow(''),
  minAmount: Joi.object({
    deposit: Joi.string().required().messages({ 'any.required': 'Please enter minimum deposit amount' }),
    withdrawal: Joi.string().required().messages({ 'any.required': 'Please enter minimum withdrawal amount' }),
  }),
  disabled: Joi.object({
    deposit: Joi.boolean().required().messages({ 'any.required': 'Please enable/disable deposit' }),
    withdrawal: Joi.boolean().required().messages({ 'any.required': 'Please enable/disable deposit' }),
  }),
  active: Joi.boolean().allow(null),
});

module.exports.update = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
  isCrypto: Joi.boolean(),
  links: Joi.array().items(Joi.string()).allow(null),
  markup: Joi.string(),
  fee: Joi.object({
    deposit: Joi.string(),
    withdrawal: Joi.string(),
  }),
  explorerLink: Joi.string().allow(''),
  minAmount: Joi.object({
    deposit: Joi.string(),
    withdrawal: Joi.string(),
  }),
  disabled: Joi.object({
    deposit: Joi.boolean(),
    withdrawal: Joi.boolean(),
  }),
  active: Joi.boolean().allow(null),
});
