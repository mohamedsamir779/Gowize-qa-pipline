const Joi = require('joi');

module.exports.getBank = Joi.object({
  id: Joi.string(),
});
