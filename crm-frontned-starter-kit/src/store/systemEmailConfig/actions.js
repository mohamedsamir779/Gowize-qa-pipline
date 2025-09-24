import {
  CHANGE_ACTIVE_EMAIL_CONFIGURATION,
  CHANGE_ACTIVE_EMAIL_CONFIGURATION_FAIL,
  CHANGE_ACTIVE_EMAIL_CONFIGURATION_SUCCESS,
  FETCH_EMAIL_CONFIGURATION,
  FETCH_EMAIL_CONFIGURATION_FAIL,
  FETCH_EMAIL_CONFIGURATION_SUCCESS,
  FETCH_NOTIFICATION_GROUPS,
  FETCH_NOTIFICATION_GROUPS_FAIL,
  FETCH_NOTIFICATION_GROUPS_SUCCESS,
  SAVE_EMAIL_CONFIGURATION,
  SAVE_EMAIL_CONFIGURATION_FAIL,
  SAVE_EMAIL_CONFIGURATION_SUCCESS,
  TEST_EMAIL_CONFIGURATION,
  TEST_EMAIL_CONFIGURATION_FAIL,
  TEST_EMAIL_CONFIGURATION_SUCCESS,
  UPDATE_NOTIFICATION_GROUPS,
  UPDATE_NOTIFICATION_GROUPS_FAIL,
  UPDATE_NOTIFICATION_GROUPS_SUCCESS
} from "./actionTypes";


export const saveEmailConfigurationStart = (params = {}) => {
  return {
    type: SAVE_EMAIL_CONFIGURATION,
    payload: params
  };
};

export const saveEmailConfigurationSuccess = (data) => {
  return {
    type: SAVE_EMAIL_CONFIGURATION_SUCCESS,
    payload: data
  };
};

export const saveEmailConfigurationFail = (error) => {
  return {
    type: SAVE_EMAIL_CONFIGURATION_FAIL,
    payload: { error }
  };
};

export const changeActiveEmailConfigurationStart = (params = {}) => {
  return {
    type: CHANGE_ACTIVE_EMAIL_CONFIGURATION,
    payload: params
  };
};

export const changeActiveEmailConfigurationSuccess = (data) => {
  return {
    type: CHANGE_ACTIVE_EMAIL_CONFIGURATION_SUCCESS,
    payload: data
  };
};

export const changeActiveEmailConfigurationFail = (error) => {
  return {
    type: CHANGE_ACTIVE_EMAIL_CONFIGURATION_FAIL,
    payload: { error }
  };
};

export const testEmailConfigurationStart = (params = {}) => {
  return {
    type: TEST_EMAIL_CONFIGURATION,
    payload: params
  };
};

export const testEmailConfigurationSuccess = (data) => {
  return {
    type: TEST_EMAIL_CONFIGURATION_SUCCESS,
    payload: data
  };
};

export const testEmailConfigurationFail = (error) => {
  return {
    type: TEST_EMAIL_CONFIGURATION_FAIL,
    payload: { error }
  };
};

export const fetchEmailConfiguration = () => {
  return {
    type: FETCH_EMAIL_CONFIGURATION
  };
};

export const fetchEmailConfigurationSuccess = (data) => {
  return {
    type: FETCH_EMAIL_CONFIGURATION_SUCCESS,
    payload: data
  };
};

export const fetchEmailConfigurationFail = (error) => {
  return {
    type: FETCH_EMAIL_CONFIGURATION_FAIL,
    payload: { error }
  };
};

export const fetchNotificationGroups = () => {
  return {
    type: FETCH_NOTIFICATION_GROUPS
  };
};

export const fetchNotificationGroupsSuccess = (data) => {
  return {
    type: FETCH_NOTIFICATION_GROUPS_SUCCESS,
    payload: data
  };
};

export const fetchNotificationGroupsFail = (error) => {
  return {
    type: FETCH_NOTIFICATION_GROUPS_FAIL,
    payload: { error }
  };
};

export const updateNotificationGroups = (params = {}) => {
  return {
    type: UPDATE_NOTIFICATION_GROUPS,
    payload: params
  };
};

export const updateNotificationGroupsSuccess = (data) => {
  return {
    type: UPDATE_NOTIFICATION_GROUPS_SUCCESS,
    payload: data
  };
};

export const updateNotificationGroupsFail = (error) => {
  return {
    type: UPDATE_NOTIFICATION_GROUPS_FAIL,
    payload: { error }
  };
};