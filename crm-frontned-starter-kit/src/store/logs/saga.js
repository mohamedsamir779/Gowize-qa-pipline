import {
  takeEvery, put, call
} from "redux-saga/effects";

// Calender Redux States
import {
  GET_LOGS_START, GET_USER_LOGS,
} from "./actionTypes";

import {
  fetchLogsEnd,
} from "./actions";
import * as logsApi from "../../apis/logs";
import { showErrorNotification } from "store/notifications/actions";

function * fetchLogs(params){
  try {
    const data = yield call(logsApi.getLogs, params);  
    yield put(fetchLogsEnd({ data }));
  }
  catch (error){
    yield put(fetchLogsEnd({ error }));
    yield put(showErrorNotification(error.message));
  } 
}

function * fetchUserLogs(params){
  try {
    const data = yield call(logsApi.getUserLogs, params);  
    yield put(fetchLogsEnd({ data }));
  }
  catch (error){
    yield put(fetchLogsEnd({ error }));
    yield put(showErrorNotification(error.message));
  } 
}

function* logsSaga() {
  yield takeEvery(GET_LOGS_START, fetchLogs);
  yield takeEvery(GET_USER_LOGS, fetchUserLogs);
}

export default logsSaga;
