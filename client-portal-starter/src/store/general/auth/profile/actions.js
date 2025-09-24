import {
  PROFILE_ERROR,
  PROFILE_SUCCESS,
  EDIT_PROFILE,
  RESET_PROFILE_FLAG,
  FETCH_PROFILE_START,
  EDIT_PROFILE_SUCCESS,
  SUBMIT_IND_PROFILE_START,
  SUBMIT_IND_PROFILE_END,

  CONVERT_PROFILE_REQUESTED,
  CONVERT_PROFILE_SUCCESS,
  CONVERT_PROFILE_FAIL,
  UPLOAD_PROFILE_AVATAR_START,
  UPLOAD_PROFILE_AVATAR_END,
  DELETE_PROFILE_AVATAR_END,
  DELETE_PROFILE_AVATAR_START,
  UPDATE_PROFILE_JOURNEY,
  UPDATE_PUSH_NOTIFICATION_OPTION,
  UPDATE_PROFILE_SETTINGS,
  UPDATE_PROFILE_SETTINGS_SUCCESS,
  UPDATE_PROFILE_SETTINGS_FAIL
} from "./actionTypes";

export const editProfile = user => {
  return {
    type: EDIT_PROFILE,
    payload: { user },
  };
};
export const editProfileSuccess = payload => {
  return {
    type: EDIT_PROFILE_SUCCESS,
    payload: payload
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

export const resetProfileFlag = () => {
  return {
    type: RESET_PROFILE_FLAG,
  };
};

export const fetchProfile = (payload) => {
  return {
    type: FETCH_PROFILE_START,
    payload
  };
};


export const submitIndProfile = (payload) => {
  return {
    type: SUBMIT_IND_PROFILE_START,
    payload
  };
};

export const submitIndProfileDone = (payload) => {
  return {
    type: SUBMIT_IND_PROFILE_END,
    payload
  };
};

// convert profile
export const convertProfile = () => {
  return {
    type: CONVERT_PROFILE_REQUESTED
  };
};
export const convertProfileSuccess = (data) => {
  return {
    type: CONVERT_PROFILE_SUCCESS,
    payload: data
  };
};
export const convertProfileFail = (error) => {
  return {
    type: CONVERT_PROFILE_FAIL,
    payload: { error }
  };
};

export const uploadProfileAvatar = (data, callback) => {
  return {
    type: UPLOAD_PROFILE_AVATAR_START,
    payload: data,
    callback
  };
};

export const uploadProfileAvatarEnd = (success, error) => {
  return {
    type: UPLOAD_PROFILE_AVATAR_END,
    payload: {
      success,
      error
    }
  };
};

export const deleteAvatarImage = (callback) => {
  return {
    type: DELETE_PROFILE_AVATAR_START,
    callback
  };
};

export const deleteAvatarImageEnd = (data) => {
  return {
    type: DELETE_PROFILE_AVATAR_END,
    payload: data
  };
};

export const updateProfileJourney = (data) => {
  return {
    type: UPDATE_PROFILE_JOURNEY,
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

export const updateProfileSettings = (data) => {
  return {
    type: UPDATE_PROFILE_SETTINGS,
    payload: data
  };
};

export const updateProfileSettingsSuccess = (data) => {
  return {
    type: UPDATE_PROFILE_SETTINGS_SUCCESS,
    payload: data
  };
};

export const updateProfileSettingsFail = (error) => {
  return {
    type: UPDATE_PROFILE_SETTINGS_FAIL,
    payload: error
  };
};