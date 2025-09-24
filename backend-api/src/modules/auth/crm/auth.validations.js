const Joi = require('joi');

module.exports.login = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports.verify = Joi.object({
  code: Joi.string().required(),
  email: Joi.string(),
  type: Joi.string().required(),
});
