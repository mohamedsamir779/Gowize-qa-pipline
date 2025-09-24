const Joi = require('joi');
const { basePagination } = require('src/common/handlers');

module.exports.listing = Joi.object({
  ...basePagination,
  customerId: Joi.string().allow(''),
  type: Joi.number().valid(0, 1, 2, 3),
  start: Joi.string().allow(''),
  end: Joi.string().allow(''),
});

module.exports.getTodo = Joi.object({
  id: Joi.string(),
});

module.exports.create = Joi.object({
  customerId: Joi.string().required(),
  note: Joi.string().required(),
  time: Joi.date(),
  timeEnd: Joi.date(),
  createdAt: Joi.date(),
  type: Joi.number().valid(0, 1, 2, 3),
  byAdmin: Joi.boolean(),
  status: Joi.string().valid('open', 'ongoing', 'completed'),
});

module.exports.update = Joi.object({
  note: Joi.string().required(),
  time: Joi.date(),
  timeEnd: Joi.date(),
  type: Joi.number().valid(0, 1, 2),
  status: Joi.string().valid('open', 'ongoing', 'completed'),
});
