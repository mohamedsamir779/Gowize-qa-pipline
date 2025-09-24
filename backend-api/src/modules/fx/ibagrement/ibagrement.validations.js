const Joi = require('joi');
const { CONSTANTS } = require('src/common/data');
const { basePagination } = require('src/common/handlers');

const products = CONSTANTS.FOREX_SUPPORTED_PRODUCTS;

module.exports.listing = Joi.object({
  ...basePagination,
  customerId: Joi.string().required(),
});

const rebateJoi = Joi.number().required().min(0).max(100);
const commissionJoi = Joi.number().required().min(0).max(100);
const productsJoi = () => {
  const dict = {};
  products.forEach((product) => {
    dict[product] = Joi.object({
      rebate: rebateJoi,
      commission: commissionJoi,
    }).required();
  });
  return dict;
};

module.exports.masterAgrement = Joi.object({
  customerId: Joi.string().required(),
  title: Joi.string().required(),
  values: Joi.array().items(Joi.object({
    accountTypeId: Joi.string().required(),
    products: Joi.object(productsJoi()).required(),
    group: Joi.string().allow(''),
    markup: Joi.string().allow(''),
  })).required().min(1),
});

// for shared agreement
module.exports.sharedAgrement = Joi.object({
  title: Joi.string().required(),
  totals: Joi.array().items(Joi.object({
    accountTypeId: Joi.string().required(),
    rebate: rebateJoi,
    commission: commissionJoi,
  })),
  members: Joi.array().min(1).items(Joi.object({
    customerId: Joi.string().required(),
    level: Joi.number().required(),
    values: Joi.array().items(Joi.object({
      accountTypeId: Joi.string().required(),
      rebate: rebateJoi,
      commission: commissionJoi,
      markup: Joi.string().allow(''),
      products: Joi.object(productsJoi()).required(),
    })).required().min(1),
  })),
});

module.exports.updateAgreementPath = Joi.object({
  id: Joi.string().required(),
});

module.exports = {
  ...module.exports,
  productsJoi,
};
