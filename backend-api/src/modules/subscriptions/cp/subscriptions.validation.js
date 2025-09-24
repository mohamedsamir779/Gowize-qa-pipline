const Joi = require('joi');

module.exports.subscribeCPPushNotification = Joi.object({
  endpoint: Joi.string().required(),
  expirationTime: Joi.string().allow(null),
  keys: Joi.object({
    p256dh: Joi.string().required(),
    auth: Joi.string().required(),
  }),
  deviceDetails: Joi.object({
    browserName: Joi.string().allow(null),
    browserVersion: Joi.string().allow(null),
    deviceName: Joi.string().allow(null),
    deviceType: Joi.string().allow(null),
    deviceVendor: Joi.string().allow(null),
    engineName: Joi.string().allow(null),
    engineVersion: Joi.string().allow(null),
    fullBrowserVersion: Joi.string().allow(null),
    mobileModel: Joi.string().allow(null),
    mobileVendor: Joi.string().allow(null),
    osName: Joi.string().allow(null),
    osVersion: Joi.string().allow(null),
    userAgent: Joi.string().allow(null),
  }),
});

module.exports.unsubscribeCPPushNotification = Joi.object({
  endpoint: Joi.string().required(),
});
