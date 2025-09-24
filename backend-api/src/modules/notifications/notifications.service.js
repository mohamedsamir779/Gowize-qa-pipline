const mongoose = require('mongoose');
const webPush = require('web-push');
const { Cruds } = require('src/common/handlers');
const { keys } = require('src/common/data');
const { logger } = require('src/common/lib');
const { PUSH_NOTIFICATION_GROUPS } = require('../../common/data/constants');
const NotificationsModel = require('./notifications.model');

class NotificationsService extends Cruds {
  constructor(model, schema, options = {}) {
    super(model || NotificationsModel.Model, schema || NotificationsModel.Schema);
    this.vapidDetails = keys.pushNotifications.vapidDetails;
  }

  async fetchNotifications(clientId, clientModel = 'users', query = {}) {
    if (!clientId) {
      throw new Error('Client ID is required');
    }
    if (!clientModel) {
      throw new Error('Client type is required');
    }
    let restQuery = {
      ...query,
      'to.clientModel': clientModel,
    };
    if (query.read === undefined || query.read === null) {
      restQuery = {
        ...restQuery,
        'to.clientId': mongoose.Types.ObjectId(clientId),
      };
    } else {
      const {
        read = false,
        ...rest
      } = query;
      restQuery = {
        ...rest,
        to: {
          $elemMatch: {
            read: { $eq: read },
            clientId: { $eq: mongoose.Types.ObjectId(clientId) },
          },
        },
      };
    }
    return this.findWithPagination(restQuery);
  }

  async markNotificationsRead(clientId, clientModel = 'users', params = {}) {
    const {
      notificationIds = [],
      all = false,
    } = params;
    if (!clientId) {
      throw new Error('Client ID is required');
    }
    if (!clientModel) {
      throw new Error('Client type is required');
    }
    let query = {
      'to.clientId': mongoose.Types.ObjectId(clientId),
      'to.clientModel': clientModel,
    };
    if (!all) {
      query = {
        ...query,
        _id: {
          $in: notificationIds.map((id) => mongoose.Types.ObjectId(id)),
        },
      };
    }
    return this.updateMany(query, {
      'to.$.read': true,
      'to.$.readTime': new Date(),
    });
  }

  getInitialPushNotificationsSettings(clientType = 'users') {
    let data = [];
    switch (clientType) {
      case 'users':
        data = Object.keys(PUSH_NOTIFICATION_GROUPS).map((key) => {
          if (key !== 'CLIENT') {
            return {
              enabled: true,
              key,
              actions: Object.keys(PUSH_NOTIFICATION_GROUPS[key]).map((action) => ({
                action,
                enabled: true,
              })),
            };
          }
        });
        break;
      case 'customers':
        data = Object.keys(PUSH_NOTIFICATION_GROUPS).map((key) => {
          if (key !== 'USER') {
            return {
              enabled: true,
              key,
              actions: Object.keys(PUSH_NOTIFICATION_GROUPS[key]).map((action) => ({
                action,
                enabled: true,
              })),
            };
          }
        });
        break;
      default:
        data = Object.keys(PUSH_NOTIFICATION_GROUPS).map((key) => ({
          enabled: true,
          key,
          actions: Object.keys(PUSH_NOTIFICATION_GROUPS[key]).map((action) => ({
            action,
            enabled: true,
          })),
        }));
    }
    data = data.filter((item) => item);
    return data;
  }

  sendPushNotification(subscriptions = [], params = {}) {
    const {
      title,
      body,
      icon,
      image,
      badge,
      tag,
      data,
    } = params;
    const notification = {
      title,
      body,
      icon,
      image,
      badge,
      tag,
      data,
      to: [],
    };
    const notificationId = mongoose.Types.ObjectId();
    subscriptions.forEach((subscription) => {
      const pushSubscription = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
        },
      };
      const pushNotificationPayload = {
        title,
        body,
        icon,
        data: {
          ...data,
          notificationId: notificationId.toString(),
          to: [{
            clientId: subscription.clientId.toString(),
            read: false,
          }],
          extraParams: {
            ...data.extraParams,
          },
        },
      };
      const foundNotification = notification.to.find(
        (item) => item.clientId.toString() === subscription.clientId.toString(),
      );
      if (!foundNotification) {
        notification.to.push({
          clientId: subscription.clientId,
          clientModel: subscription.clientModel,
        });
      }
      console.log(this.vapidDetails);
      console.log(pushNotificationPayload);
      webPush.sendNotification(
        pushSubscription,
        JSON.stringify(pushNotificationPayload),
        {
          vapidDetails: this.vapidDetails,
        },
      ).then((resp) => {
        logger.info(`Push notification sent to ${subscription.clientId} (${subscription.clientModel})`);
      }).catch((error) => {
        logger.info(`Error pushing notification sent to ${subscription.clientId} (${subscription.clientModel}), ${error.message}`);
      });
    });
    this.create({
      ...notification,
      _id: notificationId,
    });
  }
}

module.exports = new NotificationsService(NotificationsModel.Model, NotificationsModel.Schema);
