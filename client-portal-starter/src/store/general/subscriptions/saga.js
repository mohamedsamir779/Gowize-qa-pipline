// eslint-disable-next-line object-curly-newline
import { call, put, takeEvery } from "redux-saga/effects";

import {
  SUBSCRIBE_PUSH_NOTIFICATION,
  UNSUBSCRIBE_PUSH_NOTIFICATION,
} from "./actionTypes";

import {
  subscribePushNotificationSuccess,
  subscribePushNotificationError,
  unsubscribePushNotificationsSuccess,
  unsubscribePushNotificationsError,
} from "./actions";

import * as api from "../../../apis/subscriptions";
import {
  showErrorNotification,
  showSuccessNotification,
} from "store/general/notifications/actions";
import { updatePushNotificationOption } from "store/actions";

function* subscribePushNotification({ payload }) {
  try {
    const { data } = yield call(api.subscribePushNotification, payload);
    // eslint-disable-next-line no-console
    console.log("data", data);

    yield put(subscribePushNotificationSuccess());
    yield put(
      showSuccessNotification("Push notification subscribed successfully")
    );
    yield put(updatePushNotificationOption(true));
  } catch (error) {
    yield put(subscribePushNotificationError(error));
    yield put(showErrorNotification("Push notification subscription failed"));
  }
}

function* unSubscribePushNotifications({ payload }) {
  try {
    const { data } = yield call(api.unsubscribePushNotification, payload);
    yield put(unsubscribePushNotificationsSuccess(data));
    yield put(
      showSuccessNotification("Push notification unsubscribed successfully")
    );
    yield put(updatePushNotificationOption(false));
  } catch (error) {
    yield put(unsubscribePushNotificationsError(error));
    yield put(showErrorNotification("Push notification unsubscription failed"));
  }
}

function* subscriptionsSaga() {
  yield takeEvery(SUBSCRIBE_PUSH_NOTIFICATION, subscribePushNotification);
  yield takeEvery(UNSUBSCRIBE_PUSH_NOTIFICATION, unSubscribePushNotifications);
}

export default subscriptionsSaga;
