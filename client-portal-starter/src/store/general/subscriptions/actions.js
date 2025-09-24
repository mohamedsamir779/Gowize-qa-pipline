const {
  SUBSCRIBE_PUSH_NOTIFICATION,
  SUBSCRIBE_PUSH_NOTIFICATION_SUCCESS,
  SUBSCRIBE_PUSH_NOTIFICATION_ERROR,
  UNSUBSCRIBE_PUSH_NOTIFICATION,
  UNSUBSCRIBE_PUSH_NOTIFICATION_SUCCESS,
  UNSUBSCRIBE_PUSH_NOTIFICATION_ERROR,
} = require("./actionTypes");

export const subscribePushNotification = (payload) => ({
  type: SUBSCRIBE_PUSH_NOTIFICATION,
  payload,
});

export const subscribePushNotificationSuccess = (payload) => ({
  type: SUBSCRIBE_PUSH_NOTIFICATION_SUCCESS,
  payload,
});

export const subscribePushNotificationError = (payload) => ({
  type: SUBSCRIBE_PUSH_NOTIFICATION_ERROR,
  payload,
});

export const unsubscribePushNotifications = (unsubUrl) => ({
  type: UNSUBSCRIBE_PUSH_NOTIFICATION,
  payload: unsubUrl,
});

export const unsubscribePushNotificationsSuccess = (payload) => ({
  type: UNSUBSCRIBE_PUSH_NOTIFICATION_SUCCESS,
  payload,
});

export const unsubscribePushNotificationsError = (error) => ({
  type: UNSUBSCRIBE_PUSH_NOTIFICATION_ERROR,
  payload: error,
});
