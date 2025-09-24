const Joi = require('joi');

module.exports.update = Joi.object({
  title: Joi.string(),
  firstName: Joi.string(),
  lastName: Joi.string(),

  country: Joi.string(),
  nationality: Joi.string(),
  city: Joi.string(),
  phone: Joi.string(),
  agent: Joi.string(),
  callStatus: Joi.string(),
  dob: Joi.string(),
  gender: Joi.string(),
  address1: Joi.string(),
  address2: Joi.string(),
  declarations: Joi.array().items(Joi.string()),
});

module.exports.settingsUpdate = Joi.object({
  settings: {
    pushNotifications: Joi.array(),
    twoFactorAuthEnabled: Joi.boolean(),
  },
});

module.exports.submitIndProfile = Joi.object({
  title: Joi.string(),
  nationality: Joi.string(),
  city: Joi.string(),
  country: Joi.string(),
  dob: Joi.string(),
  gender: Joi.string(),
  address: Joi.string(),
  address2: Joi.string().allow(''),
  language: Joi.string(),
  politicallyExposed: Joi.string(),
  usCitizen: Joi.string(),
  zipCode: Joi.string().allow(''),
  declarations: Joi.array().items(Joi.string()),
  experience: Joi.object({
    profession: Joi.string(),
    employmentStatus: Joi.string(),
    employer: Joi.string().allow(''),
    jobTitle: Joi.string(),
  }),
  financialInfo: Joi.object({
    annualIncome: Joi.string(),
    sourceOfFunds: Joi.string(),
    workedInFinancial: Joi.string(),
  }),
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
    })),
    shareholders: Joi.array().items(Joi.object({
      firstName: Joi.string(),
      lastName: Joi.string(),
      sharesPercentage: Joi.number(),
      usCitizen: Joi.boolean(),
    })),
    authorizedPerson: Joi.object({
      firstName: Joi.string(),
      lastName: Joi.string(),
      usCitizen: Joi.boolean(),
      jobTitle: Joi.string(),
      phone: Joi.string(),
      landline: Joi.string(),
    }),
  }),
});

module.exports.uploadProfileAvatar = Joi.object({
  type: Joi.string().required,
});
