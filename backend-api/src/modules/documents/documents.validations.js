const Joi = require('joi');
const { CONSTANTS } = require('src/common/data');

module.exports.pathCustomer = Joi.object({
  customerId: Joi.string(),
});

module.exports.documentActions = Joi.object({
  customerId: Joi.string(),
  status: Joi.string().valid(...Object.values(CONSTANTS.DCOUMENTS_STATUS)).required(),
  documentId: Joi.string(),
});

module.exports.documentDelete = Joi.object({
  customerId: Joi.string(),
  documentId: Joi.string(),
});

module.exports.uploadDoc = Joi.object({
  type: Joi.string().required(),
  subType: Joi.string(),
  shareholderId: Joi.string(),
});

module.exports.updateBankAccount = Joi.object({
  accountHolderName: Joi.string(),
  bankName: Joi.string(),
  address: Joi.string(),
  iban: Joi.string().length(16),
  currency: Joi.string(),
  accountNumber: Joi.string(),
  swiftCode: Joi.string(),
});

module.exports.getById = Joi.object({
  id: Joi.string().required(),
});
