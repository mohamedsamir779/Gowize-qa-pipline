import {
  PROFILE_ERROR,
  PROFILE_SUCCESS,
  EDIT_PROFILE,
  RESET_PROFILE_FLAG,
  GET_PROFILE,
  GET_PROFILE_SUCCESS,
  CLEAR_PROFILE,
  EDIT_PROFILE_SETTINGS_SUCCESS,
  EDIT_PROFILE_SETTINGS_START,
  EDIT_PROFILE_SETTINGS_FAIL,
  UPDATE_PUSH_NOTIFICATION_OPTION,
  CHANGE_ACTIVE_USER_EMAIL_CONFIGURATION,
  CHANGE_ACTIVE_USER_EMAIL_CONFIGURATION_FAIL,
  CHANGE_ACTIVE_USER_EMAIL_CONFIGURATION_SUCCESS,
  SAVE_USER_EMAIL_CONFIGURATION,
  SAVE_USER_EMAIL_CONFIGURATION_FAIL,
  SAVE_USER_EMAIL_CONFIGURATION_SUCCESS,
  TEST_USER_EMAIL_CONFIGURATION,
  TEST_USER_EMAIL_CONFIGURATION_FAIL,
  TEST_USER_EMAIL_CONFIGURATION_SUCCESS,
} from "./actionTypes";

export const editProfile = user => {
  return {
    type: EDIT_PROFILE,
    payload: { user },
  };
};

export const profileSuccess = msg => {
  return {
    type: PROFILE_SUCCESS,
    payload: msg,
  };
};

export const profileError = error => {
  return {
    type: PROFILE_ERROR,
    payload: error,
  };
};

export const resetProfileFlag = error => {
  return {
    type: RESET_PROFILE_FLAG,
    payload: error,
  };
};
export const getUserProfile = () => {
  return {
    type: GET_PROFILE
  };
};
export const getProfileSuccess = (data) => {
  return {
    type: GET_PROFILE_SUCCESS,
    payload: data
  };
};
export const clearProfile = () => {
  return {
    type: CLEAR_PROFILE
  };
};

export const editProfileSettingsStart = (params = {}) => {
  return {
    type: EDIT_PROFILE_SETTINGS_START,
    payload: params
  };
};

export const editProfileSettingsSuccess = (data) => {
  return {
    type: EDIT_PROFILE_SETTINGS_SUCCESS,
    payload: data
  };
};

export const editProfileSettingsFail = (data) => {
  return {
    type: EDIT_PROFILE_SETTINGS_FAIL,
    payload: data
  };
};

export const updatePushNotificationOption = (enabled = false) => {
  return {
    type: UPDATE_PUSH_NOTIFICATION_OPTION,
    payload: {
      enabled,
    },
  };
};
// email config
export const saveUserEmailConfigurationStart = (params = {}) => {
  return {
    type: SAVE_USER_EMAIL_CONFIGURATION,
    payload: params
  };
};

export const saveUserEmailConfigurationSuccess = (data) => {
  return {
    type: SAVE_USER_EMAIL_CONFIGURATION_SUCCESS,
    payload: data
  };
};

export const saveUserEmailConfigurationFail = (error) => {
  return {
    type: SAVE_USER_EMAIL_CONFIGURATION_FAIL,
    payload: { error }
  };
};

export const changeActiveUserEmailConfigurationStart = (params = {}) => {
  return {
    type: CHANGE_ACTIVE_USER_EMAIL_CONFIGURATION,
    payload: params
  };
};

export const changeActiveUserEmailConfigurationSuccess = (data) => {
  return {
    type: CHANGE_ACTIVE_USER_EMAIL_CONFIGURATION_SUCCESS,
    payload: data
  };
};

export const changeActiveUserEmailConfigurationFail = (error) => {
  return {
    type: CHANGE_ACTIVE_USER_EMAIL_CONFIGURATION_FAIL,
    payload: { error }
  };
};

export const testUserEmailConfigurationStart = (params = {}) => {
  return {
    type: TEST_USER_EMAIL_CONFIGURATION,
    payload: params
  };
};

export const testUserEmailConfigurationSuccess = (data) => {
  return {
    type: TEST_USER_EMAIL_CONFIGURATION_SUCCESS,
    payload: data
  };
};

export const testUserEmailConfigurationFail = (error) => {
  return {
    type: TEST_USER_EMAIL_CONFIGURATION_FAIL,
    payload: { error }
  };
};
