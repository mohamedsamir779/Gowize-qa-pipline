import {  FETCH_CONVERSION_RATES_START } from "./actionTypes";
import {
  takeEvery, call, fork, all, put 
} from "redux-saga/effects";
import { getConversionRate } from "../../../apis/conversionRate";
import {  fetchConversionRateSuccess } from "store/actions";

function* fetchConversionRate({ payload }) {
  try {
    const result = yield call(getConversionRate, payload);
    yield put(fetchConversionRateSuccess({
      success: true,
      result
    }));
  } catch (error) {
    yield put(fetchConversionRateSuccess({
      success: false,
      message: error.message
    }));
  }
}

function* watchConversion() {
  yield takeEvery(FETCH_CONVERSION_RATES_START, fetchConversionRate);
}

function* conversionSaga() {
  yield all([fork(watchConversion)]);
}

export default conversionSaga;