const express = require('express');

const router = express.Router();
const {
  authMW,
  valMW,
} = require('src/shared/middlewares/cp-mw');

const {
  subscribeCPPushNotification,
  unsubscribeCPPushNotification,
} = require('./subscriptions.validation');

const SubscriptionsController = require('./subscriptions.controller');

router.use(authMW);

router.post('/push-notification', valMW(subscribeCPPushNotification), SubscriptionsController.subscribeCPPushNotification);
router.delete('/push-notification', valMW(unsubscribeCPPushNotification), SubscriptionsController.unsubscribeCPPushNotification);

module.exports = router;
module.exports.routerName = 'subscriptions';
