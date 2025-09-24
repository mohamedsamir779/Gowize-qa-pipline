const mongoose = require('mongoose');
const {
  CONSTANTS,
} = require('src/common/data');
const {
  logsService,
  dLogsService,
  rolesService,
  userService,
  subscriptionsService,
} = require('src/modules/services');
const notificationsService = require('../../../modules/notifications/notifications.service');
const { getPushNotificationData } = require('../general');
const { emitter } = require('./emitter');

const {
  EVENT_TYPES,
} = CONSTANTS;

emitter.on(EVENT_TYPES.EVENT_LOG, (eventData) => {
  // eslint-disable-next-line no-console
  const {
    type,
    data,
    demo = false,
  } = eventData;
  const {
    customerId,
    userId,
    triggeredBy,
    level,
    userLog,
    details,
    content,
  } = data;
  if (demo) {
    dLogsService.addLog(
      type,
      customerId,
      userId,
      triggeredBy,
      userLog,
      level,
      details,
      content,
    );
  } else {
    logsService.addLog(
      type,
      customerId,
      userId,
      triggeredBy,
      userLog,
      level,
      details,
      content,
    );
  }
});

emitter.on(EVENT_TYPES.EVENT_CHAIN_ADDRESS_CREATED, (eventData) => {
});

emitter.on(EVENT_TYPES.PUSH_NOTIFICATION, async (eventData) => {
  const {
    type,
    data: pushNotificationData,
  } = eventData;
  const {
    pushNotificationType,
    pushNotificationGroup,
    from,
    to,
  } = type;
  // find all users who need these notifications
  const roles = await rolesService.find({});
  const role = roles.filter(
    (r) => r.pushNotifications
      && r.pushNotifications.find(
        (p) => p.key === pushNotificationGroup && p.enabled
          && p.actions.find((a) => a.action === pushNotificationType && a.enabled),
      ),
  );
  const foundUsers = await userService.find(
    {
      roleId: { $in: role.map((r) => r._id) },
    },
    {
      _id: 1,
    },
  );
  const userIds = foundUsers.map((user) => user._id);
  to.push(...userIds);
  const subscriptions = await subscriptionsService.find({
    clientId: {
      $in: to.map((id) => mongoose.Types.ObjectId(id)),
    },
  }, {}, {
    populate: {
      path: 'clientId',
      select: 'settings',
    },
  });
  const filteredClientSubscriptions = subscriptions.filter((subscription) => {
    if (
      subscription.clientId && subscription.clientId.settings
      && subscription.clientId.settings.pushNotifications
    ) {
      const {
        pushNotifications,
      } = subscription.clientId.settings;
      const foundGroup = pushNotifications.find(
        (group) => group.key === pushNotificationGroup && group.enabled,
      );
      const findNotification = foundGroup
        && foundGroup.actions.find(
          (notification) => notification.action === pushNotificationType && notification.enabled,
        );
      if (findNotification) {
        return true;
      }
      return false;
    }
    return false;
  });
  const notificationsToSend = [];
  if (filteredClientSubscriptions.length) {
    filteredClientSubscriptions.forEach((clientSubscription) => {
      if (clientSubscription.subscriptions
        && clientSubscription.subscriptions.length > 0) {
        clientSubscription.subscriptions.forEach((subscription) => notificationsToSend.push(
          {
            clientId: clientSubscription.clientId._id,
            clientModel: clientSubscription.clientModel,
            endpoint: subscription.endpoint,
            keys: subscription.keys,
          },
        ));
      }
    });
  }
  const data = getPushNotificationData(pushNotificationType, pushNotificationData);
  notificationsService.sendPushNotification(notificationsToSend, data);
});

emitter.on(EVENT_TYPES.SEND_PUSH_NOTIFICATION, async (eventData) => {
  const {
    type,
    data: pushNotificationData,
  } = eventData;
  const {
    pushNotificationType,
    pushNotificationGroup,
    from,
    to,
  } = type;

  const roles = await rolesService.find({});
  const role = roles.filter(
    (r) => r.pushNotifications
      && r.pushNotifications.find(
        (p) => p.key === pushNotificationGroup && p.enabled
          && p.actions.find((a) => a.action === pushNotificationType && a.enabled),
      ),
  );
  const foundUsers = await userService.find(
    {
      _id: { $in: to.map((id) => mongoose.Types.ObjectId(id)) },
      roleId: { $in: role.map((r) => r._id) },
    },
    {
      _id: 1,
    },
  );
  const userIds = foundUsers.map((user) => user._id);
  const subscriptions = await subscriptionsService.find({
    clientId: {
      $in: userIds,
    },
  }, {}, {
    populate: {
      path: 'clientId',
      select: 'settings',
    },
  });
  console.log('subscriptions: ', subscriptions);
  const filteredClientSubscriptions = subscriptions.filter((subscription) => {
    if (
      subscription.clientId && subscription.clientId.settings
      && subscription.clientId.settings.pushNotifications
    ) {
      const {
        pushNotifications,
      } = subscription.clientId.settings;
      const foundGroup = pushNotifications.find(
        (group) => group.key === pushNotificationGroup && group.enabled,
      );
      const findNotification = foundGroup
        && foundGroup.actions.find(
          (notification) => notification.action === pushNotificationType && notification.enabled,
        );
      if (findNotification) {
        return true;
      }
      return false;
    }
    return false;
  });
  const notificationsToSend = [];
  if (filteredClientSubscriptions.length) {
    filteredClientSubscriptions.forEach((clientSubscription) => {
      if (clientSubscription.subscriptions
        && clientSubscription.subscriptions.length > 0) {
        clientSubscription.subscriptions.forEach((subscription) => notificationsToSend.push(
          {
            clientId: clientSubscription.clientId._id,
            clientModel: clientSubscription.clientModel,
            endpoint: subscription.endpoint,
            keys: subscription.keys,
          },
        ));
      }
    });
  }
  const data = getPushNotificationData(pushNotificationType, pushNotificationData);
  notificationsService.sendPushNotification(notificationsToSend, data);
});
