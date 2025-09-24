import {
  call, put, takeEvery,
} from "redux-saga/effects";

import {
  FETCH_NOTIFICATIONS,
  MARK_NOTIFICATIONS_READ
} from "./actionTypes";

import {
  fetchNotificationsSuccess,
  fetchNotificationsFailed,
  markNotificationReadSuccess,
  markNotificationReadFailed,
} from "./actions";

import * as api from "../../../apis/notifications";
import { showErrorNotification } from "../../../store/general/notifications/actions";

function* fetchNotifications({ payload }) {
  try {
    const { result } = yield call(api.fetchNotifications, payload);
    if (result) {
      if ((payload.read === false || payload.read === "false")) {
        yield put(fetchNotificationsSuccess({
          ...result,
          unread: true,
        }));
      } else {
        yield put(fetchNotificationsSuccess(result));
      }
    } else {
      yield put(fetchNotificationsFailed("Error fetching notifications"));
      yield put(showErrorNotification("Error fetching notifications"));
    }
  } catch (error) {
    yield put(fetchNotificationsFailed("Error fetching notifications"));
    yield put(showErrorNotification("Error fetching notifications"));
  }
}

function* markNotificationsRead({ payload }) {
  try {
    const { result } = yield call(api.markNotificationsRead, payload);
    if (result) {
      yield put(markNotificationReadSuccess(payload));
    } else {
      yield put(markNotificationReadFailed("Error marking notification as read"));
    }
  } catch (error) {
    yield put(markNotificationReadFailed("Error marking notification as read"));
  }
}


function* notificationsSaga() {
  yield takeEvery(FETCH_NOTIFICATIONS, fetchNotifications);
  yield takeEvery(MARK_NOTIFICATIONS_READ, markNotificationsRead);
}

export default notificationsSaga;