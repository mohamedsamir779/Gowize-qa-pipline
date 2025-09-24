const Joi = require('joi');

module.exports.login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports.verify = Joi.object({
  token: Joi.string().required(),
  email: Joi.string(),
  type: Joi.string().required(),
});
