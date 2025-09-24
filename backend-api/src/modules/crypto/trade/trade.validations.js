const Joi = require('joi');

module.exports.getRole = Joi.object({
  id: Joi.string(),
});
