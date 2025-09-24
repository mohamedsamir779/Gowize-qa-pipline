import { show } from "react-notification-system-redux";
import {
  FETCH_NOTIFICATIONS,
  FETCH_NOTIFICATIONS_ERROR,
  FETCH_NOTIFICATIONS_SUCCESS,
  MARK_NOTIFICATIONS_READ,
  MARK_NOTIFICATIONS_READ_ERROR,
  MARK_NOTIFICATIONS_READ_SUCCESS,
  RECEIVED_NOTIFICATION,
} from "./actionTypes";

const notificationTitles = {
  success: "Success!",
  error: "Error!"
};
const notification = ({ type = "success", message = "" }) => ({
  title: notificationTitles[type],
  message,
  position: "tr",
  autoDismiss: 5
});

// const showNotification = ({ message = "", type = "success" }) => (
//   dispatch
// ) => {
//   dispatch(show(notification({
//     message,
//     type
//   })));
// };

export const showErrorNotification = (message = "") => {
  //parameter message should be type string only 
  const type = "error";
  return show(notification({
    message,
    type
  }), type);
};

export const showSuccessNotification = (message = "") => {
  //parameter message should be type string only 
  const type = "success";
  return show(notification({
    message,
    type
  }), type);
};

export const fetchNotifications = (params = {}) => {
  return {
    type: FETCH_NOTIFICATIONS,
    payload: params
  };
};

export const fetchNotificationsSuccess = (payload) => {
  return {
    type: FETCH_NOTIFICATIONS_SUCCESS,
    payload
  };
};

export const fetchNotificationsFailed = (error) => {
  return {
    type: FETCH_NOTIFICATIONS_ERROR,
    payload: error
  };
};

export const markNotificationRead = (params = {}) => {
  return {
    type: MARK_NOTIFICATIONS_READ,
    payload: params,
  };
};

export const markNotificationReadSuccess = (payload) => {
  return {
    type: MARK_NOTIFICATIONS_READ_SUCCESS,
    payload
  };
};

export const markNotificationReadFailed = (error) => {
  return {
    type: MARK_NOTIFICATIONS_READ_ERROR,
    payload: error
  };
};

export const receivedNotification = (payload) => {
  return {
    type: RECEIVED_NOTIFICATION,
    payload
  };
};

export const NO_ACCESS_MESSAGE = "No permissions to access this resource";
