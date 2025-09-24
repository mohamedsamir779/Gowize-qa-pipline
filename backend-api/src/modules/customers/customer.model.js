/* eslint-disable func-names */
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(require('mongoose'));
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const jwt = require('jsonwebtoken');
const { keys, CONSTANTS } = require('src/common/data');
const { getCustomerCategory } = require('../../common/handlers');
const { customerDefaultPortal, customerDefaultSubPortal } = require('../../common/data/keys');
const { CALL_STATUS } = require('../../common/data/constants');
const { getInitialPushNotificationsSettings } = require('../notifications/notifications.service');

const { model, Schema } = mongoose;

const CustomerSchema = new Schema(
  {

    recordId: { type: Number },
    oldRecordId: { type: String },
    title: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String, required: false },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    country: { type: String, required: true },
    nationality: { type: String },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    mobile: { type: String, required: false },
    dob: { type: String },
    callStatus: { type: String, default: CALL_STATUS.NEW },
    agent: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: false,
    },
    gender: { type: String },
    address: { type: String },
    address2: { type: String },
    zipCode: { type: String },
    referral: { type: String, default: Math.random().toString(36).slice(2, 10) },
    language: { type: String, default: 'en' },
    stages: {
      type: {
        sumsubId: { type: String, default: '' },
        kycUpload: { type: Boolean, default: false },
        kycApproved: { type: Boolean, default: false },
        kycRejected: { type: Boolean, default: false },
        kycExpired: { type: Boolean, default: false },
        madeDeposit: { type: Boolean, default: false },
        emailVerified: { type: Boolean, default: false },
        phoneVerified: { type: Boolean, default: false },
        startTrading: { type: Boolean, default: false },
        openAccount: { type: Boolean, default: false },

        individual: {
          type: {
            submitProfile: { type: Boolean, default: false },
          },
        },
        ib: {
          type: {
            submitProfile: { type: Boolean, default: false },
            ibQuestionnaire: { type: Boolean, default: false },
            partnershipAgreement: { type: Boolean, default: false },
          },
        },
      },
      default: {
        sumsubId: '',
        kycUpload: false,
        kycApproved: false,
        kycRejected: false,
        madeDeposit: false,
        emailVerified: false,
        phoneVerified: false,
        startTrading: false,

        individual: {
          submitProfile: false,
        },
        ib: {
          submitProfile: false,
          ibQuestionnaire: false,
          partnershipAgreement: false,
        },
      },
    },

    idDetails: {
      type: { type: String, default: '' },
      documentNo: { type: String, default: '' },
      dateOfIssue: { type: String, default: '' },
      dateOfExpiry: { type: String, default: '' },
      countryOfIssue: { type: String, default: '' },
    },

    fatca: { type: String, default: '', enum: ['yes', 'no', ''] },
    politicallyExposed: { type: String, default: '', enum: ['yes', 'no', ''] },
    workedInCrypto: { type: String, default: '', enum: ['yes', 'no', ''] },
    taxIdentificationNumber: { type: String },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: false,
    },
    source: {
      type: String,
      default: CONSTANTS.CUSTOMER_SOURCES.DEMO,
    },
    category: {
      type: String,
      enum: Object.keys(CONSTANTS.CUSTOMER_CATEGORIES),
    },
    customerType: {
      type: String,
      enum: Object.keys(CONSTANTS.CUSTOMER_TYPES),
      default: CONSTANTS.CUSTOMER_TYPES.INDIVIDUAL,
    },
    isLead: { type: Boolean, default: false },
    isCorporate: { type: Boolean, default: false },
    fx: {
      isDemo: { type: Boolean, default: false },
      isClient: { type: Boolean, default: false },
      isIb: { type: Boolean, default: false },
      liveAcc: { type: Object, default: [] },
      demoAcc: { type: Object, default: [] },
      ibCTRADERAcc: { type: Object, default: [] },
      ibMT5Acc: { type: Object, default: [] },
      ibMT4Acc: { type: Object, default: [] },
      agrementId: {
        type: Schema.Types.ObjectId,
        ref: 'IbAgrement',
      },
      agrementLinkTime: {
        type: Date,
      },
      ibQuestionnaire: {
        type: {
          haveSite: { type: String, enum: ['yes', 'no'] },
          pastIssue: { type: String, enum: ['yes', 'no'] },
          refOther: { type: String },
          targetCountries: [{ type: String }],
          getClient: { type: String },
          expectedClients: { type: Number },
        },
        default: undefined,
      },
      demoConvertTime: {
        type: Date,
      },
    },
    crypto: {
      isDemo: { type: Boolean, default: false },
      isClient: { type: Boolean, default: false },
      isIb: { type: Boolean, default: false },
    },
    gold: {
      isClient: { type: Boolean, default: false },
    },
    mm: {
      isClient: { type: Boolean, default: false },
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'customers',
    },
    parentLinkTime: {
      type: Date,
    },
    isActive: { type: Boolean, default: true },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },

    // salesAgentId: { type: Schema.Types.ObjectId, },
    password: { type: String },
    declarations: [{ type: String }],
    markupId: {
      type: Schema.Types.ObjectId,
      ref: 'markup',
    },
    transactionFeeId: {
      type: Schema.Types.ObjectId,
      ref: 'transaction-fee-group',
    },
    tradingFeeId: {
      type: Schema.Types.ObjectId,
      ref: 'fee-group',
    },
    experience: {
      type: {
        employmentStatus: { type: String, default: '' },
        profession: { type: String },
        jobTitle: { type: String },
        employer: { type: String },
      },
    },
    inquiry: {
      type: String,
    },
    financialInfo:
    {
      type: {
        annualIncome: { type: String },
        sourceOfFunds: { type: String },
        workedInFinancial: { type: String, default: '', enum: ['yes', 'no', ''] },
      },
    },
    lastLogin: {
      type: Date,
    },
    usCitizen: { type: String, default: '', enum: ['yes', 'no', ''] },
    corporateInfo: {
      nature: String,
      turnOver: Number,
      balanceSheet: Number,
      purpose: [{ type: String }],
      sameAddress: Boolean,
      hqAddress: {
        address: String,
        city: String,
        country: String,
        zipCode: String,
      },
      directors: [{
        firstName: String,
        lastName: String,
        usCitizen: Boolean,
        workedInFinancial: Boolean,
        politicallyExposed: Boolean,
      }],
      shareholders: [{
        firstName: String,
        lastName: String,
        sharesPercentage: Number,
        usCitizen: Boolean,
        workedInFinancial: Boolean,
        politicallyExposed: Boolean,
      }],
      authorizedPerson: {
        firstName: String,
        lastName: String,
        jobTitle: String,
        phone: String,
        landline: String,
        usCitizen: Boolean,
        workedInFinancial: Boolean,
        politicallyExposed: Boolean,
      },
    },

    twoFactorSecret: { type: Object, default: {} },
    settings: {
      twoFactorAuthEnabled: { type: Boolean, default: false },
      pushNotifications: {
        type: [{
          enabled: { type: Boolean },
          key: { type: String },
          actions: {
            type: [{
              action: { type: String },
              enabled: { type: Boolean },
            }],
          },
        }],
        default: () => getInitialPushNotificationsSettings('customers'),
      },
    },
    profileAvatar: { type: String, default: '' },
    defaultPortal: { type: String, default: customerDefaultPortal },
    defaultSubPortal: { type: String, default: customerDefaultSubPortal },
  },
  { timestamps: true },
);

CustomerSchema.methods.generateAuthToken = function () {
  const category = getCustomerCategory(this);
  const token = jwt.sign(
    {
      _id: this.id,
      email: this.email,
      is_active: this.isActive,
      category,
      defaultPortal: this.defaultPortal || customerDefaultPortal,
      defaultSubPortal: this.defaultSubPortal || customerDefaultSubPortal,
      isLead: this.isLead,
      settings: {
        twoFactorAuthEnabled: this.settings.twoFactorAuthEnabled,
      },
      twoFactorSecret: this.twoFactorSecret,
    },
    keys.jwtKey,
    { expiresIn: keys.cpTokenTime.jwtTime },
  );
  return token;
};

CustomerSchema.methods.generateResetPasswordToken = function () {
  const token = jwt.sign(
    {
      _id: this.id,
      email: this.email,
    },
    keys.jwtKey,
    { expiresIn: keys.cpResetPasswordTokenTime.jwtTime },
  );
  return token;
};

CustomerSchema.index({
  firstName: 1,
  lastName: 1,
  email: 1,
  phone: 1,
  country: 1,
  nationality: 1,
  source: 1,
  category: 1,
  createdAt: -1,
});

CustomerSchema.plugin(mongoosePaginate);
CustomerSchema.plugin(aggregatePaginate);
CustomerSchema.plugin(AutoIncrement, {
  id: 'customerCounter',
  inc_field: 'recordId',
  start_seq: 10000,
});

// CustomerSchema.index({ rec: 1 });

module.exports.Model = model('customers', CustomerSchema);
module.exports.Schema = CustomerSchema;

// mongoose.connection.collections.customers.ensureIndex({
//   firstName: 'text', lastName: 'text', email: 'text', phone: 'text', country: 'text',
// }, { language_override: 'lang', name: 'generalIndex' });
