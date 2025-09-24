const express = require('express');

const router = express.Router();
const {
  validationMiddleware,
  authMiddleware,
} = require('src/shared/middlewares/crm-mw');
const {
  subscribePushNotification, unsubscribePushNotification,
} = require('./subscriptions.validation');

const SubscriptionsController = require('./subscriptions.controller');

router.use(authMiddleware);

router.post('/push-notification', validationMiddleware(subscribePushNotification), SubscriptionsController.subscribePushNotification);
router.delete('/push-notification', validationMiddleware(unsubscribePushNotification), SubscriptionsController.unsubscribePushNotification);

module.exports = router;
module.exports.routerName = 'subscriptions';
