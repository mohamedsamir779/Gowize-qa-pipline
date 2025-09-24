import {
  call, put, takeEvery
} from "redux-saga/effects";
// Login Redux States
import {
  KLINE_HIGH_FETCH,
  OHLCV_FETCH,
} from "./actionTypes";
import {
  fetchHighKlinesSuccessful,
  fetchHighKlinesFailed,
  fetchOHLCVSuccessful,
  fetchOHLCVFailed,
} from "./actions";

//Include Both Helper File with needed methods
import * as klinesApi from "../../../apis/klines";

function* fetchHighKlines(params) {
  try {
    const data = yield call(klinesApi.fetchHighKlines, params);
    yield put(fetchHighKlinesSuccessful(data));
  }
  catch (error) {
    yield put(fetchHighKlinesFailed(error));
  }
}
function* fetchOHLCV(params) {
  try {
    const data = yield call(klinesApi.fetchOHLCV, params);
    yield put(fetchOHLCVSuccessful(data));
  }
  catch (error) {
    yield put(fetchOHLCVFailed(error));
  }
}

function* klinesSaga() {
  yield takeEvery(KLINE_HIGH_FETCH, fetchHighKlines);
  yield takeEvery(OHLCV_FETCH, fetchOHLCV);
}

export default klinesSaga;
