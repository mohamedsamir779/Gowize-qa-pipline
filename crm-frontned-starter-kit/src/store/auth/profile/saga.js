import {
  takeEvery, put, call
} from "redux-saga/effects";

// Login Redux States
import {
  CHANGE_ACTIVE_USER_EMAIL_CONFIGURATION,
  EDIT_PROFILE_SETTINGS_START, GET_PROFILE,
  SAVE_USER_EMAIL_CONFIGURATION,
  TEST_USER_EMAIL_CONFIGURATION
} from "./actionTypes";
import {
  changeActiveUserEmailConfigurationFail,
  changeActiveUserEmailConfigurationSuccess,
  editProfileSettingsFail,
  editProfileSettingsSuccess,
  getProfileSuccess,
  saveUserEmailConfigurationFail,
  saveUserEmailConfigurationSuccess,
  testUserEmailConfigurationFail,
  testUserEmailConfigurationSuccess
} from "./actions";

import * as API from "apis/profile";
import { editUserSettings } from "apis/users";
import { showErrorNotification, showSuccessNotification } from "store/notifications/actions";

export function* getUserProfileData() {
  try {
    const data = yield call(API.getProfile);
    const {
      roleId: { title: role, permissions },
      metaInfo,
      newDays,
      settings,
      emails,
      _id,
      email,
      firstName,
      lastName,
      mobile,
      phone,
      recordId: userId
    } = data.result;
    yield put(getProfileSuccess({
      ...data.result,
      permissions,
      metaInfo,
      newDays,
      settings,
      emails,
      userData: {
        _id,
        email,
        firstName,
        lastName,
        mobile,
        phone,
        role,
        userId,
      }
    }));
  } catch (error) {
  }
}

export function* updateProfileSettings({ payload }) {
  try {
    const data = yield call(editUserSettings, payload);
    yield put(editProfileSettingsSuccess(data));
    yield put(showSuccessNotification("Profile settings updated successfully"));
  } catch (error) {
    yield put(editProfileSettingsFail(error));
    yield put(showErrorNotification(error.message || "Error updating profile settings"));
  }
}

function* saveUserEmailConfiguration(params) {
  try {
    const data = yield call(API.saveEmailConfiguration, params);
    yield put(saveUserEmailConfigurationSuccess(data?.result));
    yield put(showSuccessNotification("Email configuration saved successfully"));
    if (data?.result?.isEmailConfigValid) {
      yield put(showSuccessNotification("Email configuration is valid"));
    } else {
      yield put(showErrorNotification("Email configuration is not valid"));
    }
  } catch (error) {
    yield put(showErrorNotification("Error while saving email configuration"));
    yield put(saveUserEmailConfigurationFail(error));
  }
}

function* changeActiveUserEmailConfiguration(params) {
  try {
    const data = yield call(API.changeActiveEmailConfiguration, params);
    const { result } = data;
    if (result?.isEmailConfigValid) {
      yield put(showSuccessNotification(result?.message));
    } else {
      yield put(showErrorNotification("Email configuration is not valid"));
    }
    yield put(changeActiveUserEmailConfigurationSuccess(data?.result));
  } catch (error) {
    yield put(changeActiveUserEmailConfigurationFail(error));
  }
}

function* testUserEmailConfiguration(params) {
  try {
    const data = yield call(API.testEmailConfiguration, params);
    const { result } = data;
    if (result?.isEmailConfigValid) {
      yield put(showSuccessNotification("Email configuration is valid"));
    } else {
      yield put(showErrorNotification("Email configuration is not valid"));
    }
    yield put(testUserEmailConfigurationSuccess(data));
  } catch (error) {
    yield put(testUserEmailConfigurationFail(error));
  }
}


function* ProfileSaga() {
  yield takeEvery(GET_PROFILE, getUserProfileData);
  yield takeEvery(EDIT_PROFILE_SETTINGS_START, updateProfileSettings);
  yield takeEvery(SAVE_USER_EMAIL_CONFIGURATION, saveUserEmailConfiguration);
  yield takeEvery(TEST_USER_EMAIL_CONFIGURATION, testUserEmailConfiguration);
  yield takeEvery(CHANGE_ACTIVE_USER_EMAIL_CONFIGURATION, changeActiveUserEmailConfiguration);
}

export default ProfileSaga;
