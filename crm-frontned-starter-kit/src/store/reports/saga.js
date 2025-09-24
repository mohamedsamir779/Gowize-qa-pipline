import {
  call, put, takeEvery, delay
} from "redux-saga/effects";
// Login Redux States
import {
  FETCH_REPORTS_START,
  FETCH_REPORTS_SUCCESS,
} from "./actionTypes";
import {
  fetchReportEnd,
  fetchReportStart
} from "./actions";
import { showErrorNotification, showSuccessNotification } from "store/notifications/actions";


import * as reportsApi from "../../apis/reports";

function* fetchReport(params) {
  try {
    const data = yield call(reportsApi.getReports, params);
    yield put(fetchReportEnd(data));
  }
  catch (error) {
    yield put(fetchReportEnd(error));
  }

}
function* reportsSaga() {
  yield takeEvery(FETCH_REPORTS_START, fetchReport);
}

export default reportsSaga;
