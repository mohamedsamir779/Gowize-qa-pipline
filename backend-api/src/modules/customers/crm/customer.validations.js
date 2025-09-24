const Joi = require('joi');
const { basePagination } = require('src/common/handlers');
const { productsJoi } = require('src/modules/fx/ibagrement/ibagrement.validations');

module.exports.listing = Joi.object({
  ...basePagination,
  type: Joi.string().valid('LIVE', 'DEMO'),
  fxType: Joi.string().valid('IB', 'CLIENT'),
  searchText: Joi.string(),
  filteredValues: Joi.object(),
});

module.exports.emailCheck = Joi.object({
  email: Joi.string().email().required(),
});

module.exports.find = Joi.object({
  firstName: Joi.string(),
});

module.exports.getCustomer = Joi.object({
  id: Joi.string(),
});

module.exports.customerAccess = Joi.object({
  id: Joi.string(),
  status: Joi.string().valid('activate', 'deactivate').required(),
});

module.exports.create = Joi.object({
  customerType: Joi.string().valid('INDIVIDUAL', 'CORPORATE').allow(null, ''),
  firstName: Joi.string().required(),
  lastName: Joi.string(),
  country: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  gender: Joi.string(),
  title: Joi.string().allow(''),
  language: Joi.string().allow(''),
  dob: Joi.string().allow(''),
  nationality: Joi.string().allow(''),
  city: Joi.string().allow(''),
  address: Joi.string().allow(''),
  annualIncome: Joi.string().allow(''),
  sourceOfFunds: Joi.string().allow(''),
  usCitizen: Joi.string().allow(''),
  politicallyExposed: Joi.string().allow(''),
  zipCode: Joi.string(),

  password: Joi.string(),
  declarations: Joi.array().items(Joi.string()),
  category: Joi.string().required(),
  sendWelcomeEmail: Joi.boolean().required(),
  source: Joi.string().required(),
  // ibid: Joi.string(),

  ibTitle: Joi.string(),
  values: Joi.array().items(Joi.object({
    accountTypeId: Joi.string(),
    products: Joi.object(productsJoi()),
    group: Joi.string().allow(''),
    markup: Joi.string().allow(''),
  })).min(1),

  isCorporate: Joi.boolean(),
  corporateInfo: Joi.object({
    nature: Joi.string(),
    turnOver: Joi.number(),
    balanceSheet: Joi.number(),
    purpose: Joi.array().items(Joi.string()),
    sameAddress: Joi.boolean(),
    hqAddress: {
      address: Joi.string(),
      city: Joi.string(),
      country: Joi.string(),
      zipCode: Joi.string(),
    },
    directors: Joi.array().items(Joi.object({
      firstName: Joi.string(),
      lastName: Joi.string(),
      usCitizen: Joi.boolean(),
      workedInFinancial: Joi.boolean(),
      politicallyExposed: Joi.boolean(),
    })),
    shareholders: Joi.array().items(Joi.object({
      firstName: Joi.string(),
      lastName: Joi.string(),
      sharesPercentage: Joi.number(),
      usCitizen: Joi.boolean(),
      workedInFinancial: Joi.boolean(),
      politicallyExposed: Joi.boolean(),
    })),
    authorizedPerson: Joi.object({
      firstName: Joi.string(),
      lastName: Joi.string(),
      jobTitle: Joi.string(),
      phone: Joi.string(),
      landline: Joi.string(),
      usCitizen: Joi.boolean(),
      workedInFinancial: Joi.boolean(),
      politicallyExposed: Joi.boolean(),
    }),
  }),
});

module.exports.updateCallStatus = Joi.object({
  callStatus: Joi.string().required(),
});

module.exports.update = Joi.object({
  title: Joi.string().allow(''),
  firstName: Joi.string().allow(''),
  lastName: Joi.string().allow(''),
  email: Joi.string().allow(''),
  country: Joi.string().allow(''),
  nationality: Joi.string().allow(''),
  city: Joi.string().allow(''),
  phone: Joi.string().allow(''),
  mobile: Joi.string().allow(''),
  agent: Joi.string().allow(''),
  callStatus: Joi.string().allow(''),
  dob: Joi.string().allow(''),
  gender: Joi.string().allow(''),
  address: Joi.string().allow(''),
  address2: Joi.string().allow(''),
  declarations: Joi.array().items(Joi.string()),
  isActive: Joi.string().allow('').valid(false, true),
  language: Joi.string().allow(''),
  zipCode: Joi.string().allow(''),
  source: Joi.string().allow(''),

  idDetails: Joi.object({
    type: Joi.string().allow(''),
    documentNo: Joi.string().allow(''),
    dateOfIssue: Joi.string().allow(''),
    dateOfExpiry: Joi.string().allow(''),
    countryOfIssue: Joi.string().allow(''),
  }),
  corporatePersonnel: Joi.boolean(),
  corporateInfo: Joi.object({
    nature: Joi.string(),
    turnOver: Joi.number(),
    balanceSheet: Joi.number(),
    purpose: Joi.array().items(Joi.string()),
    sameAddress: Joi.boolean(),
    hqAddress: {
      address: Joi.string(),
      city: Joi.string(),
      country: Joi.string(),
      zipCode: Joi.string(),
    },
    directors: Joi.array().items(Joi.object({
      _id: Joi.string(),
      firstName: Joi.string(),
      lastName: Joi.string(),
      usCitizen: Joi.boolean(),
      workedInFinancial: Joi.boolean(),
      politicallyExposed: Joi.boolean(),
    })),
    shareholders: Joi.array().items(Joi.object({
      _id: Joi.string(),
      firstName: Joi.string(),
      lastName: Joi.string(),
      sharesPercentage: Joi.number(),
      usCitizen: Joi.boolean(),
      workedInFinancial: Joi.boolean(),
      politicallyExposed: Joi.boolean(),
    })),
    authorizedPerson: Joi.object({
      firstName: Joi.string(),
      lastName: Joi.string(),
      jobTitle: Joi.string(),
      phone: Joi.string(),
      landline: Joi.string(),
      usCitizen: Joi.boolean(),
      workedInFinancial: Joi.boolean(),
      politicallyExposed: Joi.boolean(),
    }),
  }),

  fatca: Joi.string().allow('').valid('yes', 'no'),
  usCitizen: Joi.string().allow('').valid('yes', 'no'),
  politicallyExposed: Joi.string().allow('').valid('yes', 'no'),
  taxIdentificationNumber: Joi.string().allow(''),
  workedInCrypto: Joi.string().allow('').valid('yes', 'no'),
  markupId: Joi.string().allow(''),
  tradingFeeId: Joi.string().allow(''),
  transactionFeeId: Joi.string().allow(''),
});

module.exports.disable2FA = Joi.object({
  customerId: Joi.string().required(),
});

module.exports.assignAgent = Joi.object({
  clientId: Joi.string().required(),
  agent: Joi.string().required(),
});
