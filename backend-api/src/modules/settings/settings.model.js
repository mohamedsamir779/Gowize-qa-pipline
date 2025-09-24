const { model, Schema } = require('mongoose');
const { PUSH_NOTIFICATION_GROUPS, DEFAULT_LIMITATION } = require('../../common/data/constants');

const SettingsSchema = new Schema(
  {
    recordId: { type: Number, default: 10000 },
    email: {
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
    notification: {
      KYC: [
        {
          type: String,
          default: '',
        },
      ],
      TRANSACTIONS: [
        {
          type: String,
          default: '',
        },
      ],
      REQUESTS: [
        {
          type: String,
          default: '',
        },
      ],
      ACCOUNT: [
        {
          type: String,
          default: '',
        },
      ],
    },
    defaultLanguage: {
      type: String,
      default: 'en',
    },
    systemLanguages: {
      type: [{
        type: String,
      }],
      default: ['en', 'ar'],
    },
    portalLanguages: {
      type: [{
        type: String,
      }],
      default: ['en', 'ar'],
    },
    orderTypes: {
      type: [{
        type: String,
      }],
      default: ['limit', 'market'],
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    exchanges: {
      type: [{
        name: {
          type: String,
        },
        apiKey: {
          type: String,
        },
        secret: {
          type: String,
        },
        default: {
          type: Boolean,
        },
        extraParams: {
          type: Schema.Types.Mixed,
        },
      }],
      default: [{
        name: 'binance',
        apiKey: 'test',
        apiSecret: 'test',
        extraParams: {},
        default: true,
      }],
    },
    globalPushNotifications: {
      enabledCP: {
        type: Boolean,
        default: false,
      },
      enabledCRM: {
        type: Boolean,
        default: false,
      },
      pushNotificationGroups: Object.keys(PUSH_NOTIFICATION_GROUPS).map((key) => ({
        enabled: {
          type: Boolean,
          default: false,
        },
        key: { type: String, default: key },
        actions: Object.keys(PUSH_NOTIFICATION_GROUPS[key]).map((action) => ({
          action: { type: String, default: action },
          enabled: { type: Boolean, default: false },
        })),
      })),
    },
    limitations: {
      type: Object, default: DEFAULT_LIMITATION,
    },
  },
  { timestamps: true },
);

SettingsSchema.index({
  title: 1,
  key: 1,
  createdAt: 1,
});

module.exports.Model = model('settings', SettingsSchema);
module.exports.Schema = SettingsSchema;
