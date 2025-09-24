const express = require('express');

const router = express.Router();
const {
  validationMiddleware,
  authMiddleware,
} = require('src/shared/middlewares/crm-mw');
const {
  listing,
} = require('../notifications.validation');

const NotificationsController = require('./notifications.controller');

router.use(authMiddleware);

router.get('/', validationMiddleware(listing, true), NotificationsController.fetchNotifications);
router.patch('/mark-read', NotificationsController.markNotificationsRead);
// router.delete('/push-notification', validationMiddleware(unsubscribePushNotification), NotificationsController.unsubscribePushNotification);

module.exports = router;
module.exports.routerName = 'notifications';
