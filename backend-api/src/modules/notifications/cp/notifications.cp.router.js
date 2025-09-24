const express = require('express');

const router = express.Router();
const {
  valMW,
  authMW,
} = require('src/shared/middlewares/cp-mw');
const {
  listing,
} = require('../notifications.validation');

const NotificationsController = require('./notifications.controller');

router.use(authMW);

router.get('/', valMW(listing, true), NotificationsController.fetchNotifications);
router.patch('/mark-read', NotificationsController.markNotificationsRead);
// router.delete('/push-notification', validationMiddleware(unsubscribePushNotification), NotificationsController.unsubscribePushNotification);

module.exports = router;
module.exports.routerName = 'notifications';
