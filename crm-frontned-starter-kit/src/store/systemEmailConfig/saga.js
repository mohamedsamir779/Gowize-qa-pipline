import {
  call,  put, takeEvery
} from "redux-saga/effects";
import {
  changeActiveEmailConfigurationFail,
  changeActiveEmailConfigurationSuccess,
  fetchEmailConfigurationFail,
  fetchEmailConfigurationSuccess,
  fetchNotificationGroupsFail,
  fetchNotificationGroupsSuccess,
  saveEmailConfigurationFail,
  saveEmailConfigurationSuccess,
  testEmailConfigurationFail,
  testEmailConfigurationSuccess,
  updateNotificationGroupsFail,
  updateNotificationGroupsSuccess
} from "./actions";
import {
  CHANGE_ACTIVE_EMAIL_CONFIGURATION,
  FETCH_EMAIL_CONFIGURATION,
  FETCH_NOTIFICATION_GROUPS,
  SAVE_EMAIL_CONFIGURATION,
  TEST_EMAIL_CONFIGURATION,
  UPDATE_NOTIFICATION_GROUPS
} from "./actionTypes";
import * as emailConfig from "apis/settings/systemEmailConfig";
import { showErrorNotification, showSuccessNotification } from "store/notifications/actions";

function* fetchSystemEmailConfigurations(params) {
  try {
    const data = yield call(emailConfig.getSystemEmailConfigurations, params);
    yield put(fetchEmailConfigurationSuccess(data?.result));
  } catch (error) {
    yield put(fetchEmailConfigurationFail(error));
  }
}

function* saveEmailConfiguration(params) {
  try {
    const data = yield call(emailConfig.saveEmailConfiguration, params);
    yield put(saveEmailConfigurationSuccess(data?.result));
    yield put(showSuccessNotification("Email configuration saved successfully"));
    if (data?.result?.isEmailConfigValid) {
      yield put(showSuccessNotification("Email configuration is valid"));
    } else {
      yield put(showErrorNotification("Email configuration is not valid"));
    }
  } catch (error) {
    yield put(showErrorNotification("Error while saving email configuration"));
    yield put(saveEmailConfigurationFail(error));
  }
}

function* changeActiveEmailConfiguration(params) {
  try {
    const data = yield call(emailConfig.changeActiveEmailConfiguration, params);
    const { result } = data;
    if (result?.isEmailConfigValid) {
      yield put(showSuccessNotification(result?.message));
    } else {
      yield put(showErrorNotification("Email configuration is not valid"));
    }
    yield put(changeActiveEmailConfigurationSuccess(data?.result));
  } catch (error) {
    yield put(changeActiveEmailConfigurationFail(error));
  }
}

function* testEmailConfiguration(params) {
  try {
    const data = yield call(emailConfig.testEmailConfiguration, params);
    const { result } = data;
    if (result?.isEmailConfigValid) {
      yield put(showSuccessNotification("Email configuration is valid"));
    } else {
      yield put(showErrorNotification("Email configuration is not valid"));
    }
    yield put(testEmailConfigurationSuccess(data));
  } catch (error) {
    yield put(testEmailConfigurationFail(error));
  }
}

function* fetchNotificationGroups(params) {
  try {
    const data = yield call(emailConfig.getNotificationGroups, params);
    yield put(fetchNotificationGroupsSuccess(data?.result));
  } catch (error) {
    yield put(fetchNotificationGroupsFail(error));
  }
}

function* updateNotificationGroups(params) {
  try {
    const data = yield call(emailConfig.updateNotificationGroups, params);
    yield put(updateNotificationGroupsSuccess(data?.result));
  } catch (error) {
    yield put(updateNotificationGroupsFail(error));
  }
}

function* systemEmailConfigSaga() {
  yield takeEvery(FETCH_EMAIL_CONFIGURATION, fetchSystemEmailConfigurations);
  yield takeEvery(SAVE_EMAIL_CONFIGURATION, saveEmailConfiguration);
  yield takeEvery(CHANGE_ACTIVE_EMAIL_CONFIGURATION, changeActiveEmailConfiguration);
  yield takeEvery(TEST_EMAIL_CONFIGURATION, testEmailConfiguration);
  yield takeEvery(FETCH_NOTIFICATION_GROUPS, fetchNotificationGroups);
  yield takeEvery(UPDATE_NOTIFICATION_GROUPS, updateNotificationGroups);
}

export default systemEmailConfigSaga;
