const express = require('express');
const {
  authMiddleware,
} = require('src/shared/middlewares/crm-mw');

const router = express.Router();

router.use(authMiddleware);

const NotificationController = require('./notification.controller');

router.get('/', NotificationController.getNotificationGroups);

// add user to group
router.post('/', NotificationController.updateNotificationGroup);

module.exports = router;
module.exports.routerName = 'notification-groups';
