const { model, Schema } = require('mongoose');

const SubscriptionsSchema = new Schema(
  {
    recordId: { type: Number, default: 10000 },
    clientId: { type: Schema.Types.ObjectId, refPath: 'clientModel' },
    clientModel: {
      type: String,
      default: 'users',
      enum: ['users', 'customers'],
    },
    subscriptions: [{
      subscriptionName: { type: String },
      endpoint: { type: String },
      expirationTime: { type: String },
      keys: {
        auth: { type: String },
        p256dh: { type: String },
      },
      deviceDetails: {
        browserName: { type: String },
        browserVersion: { type: String },
        deviceType: { type: String },
        osName: { type: String },
        osVersion: { type: String },
        mobileVendor: { type: String },
        mobileModel: { type: String },
        userAgent: { type: String },
        engineName: { type: String },
        engineVersion: { type: String },
        fullBrowserVersion: { type: String },
      },
    }],
  },
  { timestamps: true },
);

SubscriptionsSchema.index({
  title: 1,
  key: 1,
  createdAt: 1,
});

module.exports.Model = model('subscriptions', SubscriptionsSchema);
module.exports.Schema = SubscriptionsSchema;
