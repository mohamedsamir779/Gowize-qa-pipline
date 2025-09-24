import {
  call, put, takeEvery
} from "redux-saga/effects";
import { getLogs } from "../../../apis/logs";
import { 
  fetchLogsSuccess, 
  fetchLogsFail, 
} from "./actions";

import { GET_LOGS_START } from "./actionTypes";
import { showErrorNotification } from "../notifications/actions";


function * fetchLogs ({ payload }){
  try {
    const data = yield call(getLogs, payload);
    const { result, status } = data;
    if (status){
      yield put(fetchLogsSuccess(result));
    }
  } catch (error){
    yield put(fetchLogsFail(error));
    yield put(showErrorNotification(error.message));
  }
}

function* logsSaga() {
  yield takeEvery(GET_LOGS_START, fetchLogs);
}

export default logsSaga;