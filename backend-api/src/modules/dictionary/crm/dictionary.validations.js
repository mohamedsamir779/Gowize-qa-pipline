const Joi = require('joi');
const { basePagination } = require('src/common/handlers');

module.exports.listing = Joi.object({
  ...basePagination,
});

module.exports.create = Joi.object({
  exchanges: Joi.array().required(),
  actions: Joi.array().required(),
  emailProviders: Joi.array().required(),
  countries: Joi.array().required(),
  markups: Joi.array().required(),
});

module.exports.addItem = Joi.object({
  exchanges: Joi.string(),
  actions: Joi.string(),
  callStatus: Joi.string(),
  color: Joi.string(),
  countries: Joi.object(),
  markups: Joi.string(),
});

module.exports.getDictionary = Joi.object({
  id: Joi.string().required(),
});

module.exports.removeItem = Joi.object({
  exchanges: Joi.string(),
  actions: Joi.string(),
  countries: Joi.string(),
  markups: Joi.string(),
});

module.exports.update = Joi.object({
  exchanges: Joi.string(),
  actions: Joi.string(),
  callStatus: Joi.string(),
  countries: Joi.object(),
  markups: Joi.string(),
  products: Joi.object({
    forex: Joi.array(),
    commodities: Joi.array(),
    indices: Joi.array(),
    stocks: Joi.array(),
    crypto: Joi.array(),
    energy: Joi.array(),
    metals: Joi.array(),
    bullion: Joi.array(),
    futureEnergy: Joi.array(),
    futureIndices: Joi.array(),
  }),
});
