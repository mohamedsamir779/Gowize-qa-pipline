const Joi = require('joi');

module.exports.addTarget = Joi.object({
  userId: Joi.string().required(),
  fx: Joi.object({
    deposit: Joi.number(),
  }),
  crypto: Joi.object({
    deposit: Joi.number(),
  }),
  accounts: Joi.number(),
  ibAccounts: Joi.number(),
  volume: Joi.number(),
});

module.exports.updateBulk = Joi.object().keys({
  targets: Joi.array().items(
    Joi.object({
      _id: Joi.string().required().allow(''),
      userId: Joi.string().required(),
      fx: Joi.object({
        deposit: Joi.number(),
      }),
      crypto: Joi.object({
        deposit: Joi.number(),
      }),
      accounts: Joi.number(),
      ibAccounts: Joi.number(),
      volume: Joi.number(),
    }),
  ),
});
