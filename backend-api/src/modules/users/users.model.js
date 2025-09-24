/* eslint-disable linebreak-style */
const { model, Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(require('mongoose'));

const jwt = require('jsonwebtoken');
const { keys } = require('src/common/data');
const { CALL_STATUS, DEFAULT_CALL_STATUS_COLOR_MAP } = require('../../common/data/constants');
const { getInitialPushNotificationsSettings } = require('../notifications/notifications.service');

const UserSchema = new Schema({

  recordId: { type: Number },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  roleId: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: false,
  },
  memberTeamId: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
    required: false,
  },
  password: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  mobile: String,
  phone: String,
  referalCode: String,
  isActive: {
    type: Boolean,
    default: true,
  },
  targetId: {
    type: Schema.Types.ObjectId,
    ref: 'target',
    required: false,
  },
  settings: {
    twoFactorAuthEnabled: { type: Boolean, default: false },
    timezone: { type: String, default: undefined },
    salesDashboard: [{ type: String, default: CALL_STATUS.NEW }],
    salesDashboardLimit: { type: Number, default: 5 },
    enableCallStatusColors: { type: Boolean, default: false },
    callStatusColors: {
      type: Object,
      default: DEFAULT_CALL_STATUS_COLOR_MAP,
    },
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
      default: () => getInitialPushNotificationsSettings('users'),
    },
  },
  emails: {
    currentProvider: {
      type: String,
      default: '',
    },
    sendGrid: {
      apiKey: {
        type: String,
        default: '',
      },
      fromEmail: {
        type: String,
        default: '',
      },
    },
    smtp: {
      fromEmail: {
        type: String,
        default: '',
      },
      server: {
        type: String,
        default: '',
      },
      port: {
        type: Number,
        default: 0,
      },
      secure: {
        type: Boolean,
        default: false,
      },
      user: {
        type: String,
        default: '',
      },
      password: {
        type: String,
        default: '',
      },
    },
  },
  twoFactorSecret: { type: Object, default: {} },
}, { timestamps: true });

// this is done as the arrow functions do not bind this to the function
// eslint-disable-next-line func-names
UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    keys.jwtKey,
    { expiresIn: keys.crmTokenTime.jwtTime },
  );
  return token;
};

// this is done as the arrow functions do not bind this to the function
// eslint-disable-next-line func-names
UserSchema.methods.generateResetPasswordToken = function () {
  const token = jwt.sign(
    {
      _id: this.id,
      email: this.email,
    },
    keys.jwtKey,
    { expiresIn: keys.crmResetPasswordTokenTime.jwtTime },
  );
  return token;
};

UserSchema.index({
  firstName: 1,
  lastName: 1,
  email: 1,
  phone: 1,
  createdAt: 1,
});

UserSchema.plugin(mongoosePaginate);
UserSchema.plugin(AutoIncrement, {
  id: 'userCounter',
  inc_field: 'recordId',
  start_seq: 10000,
});
// UserSchema.index({ rec: 1 });

module.exports.Model = model('users', UserSchema);
module.exports.Schema = UserSchema;
