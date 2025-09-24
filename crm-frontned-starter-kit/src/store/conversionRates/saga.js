import {
  call, put, takeEvery
} from "redux-saga/effects";
import * as conversionRateApi from "../../apis/conversionRates";
import { showErrorNotification, showSuccessNotification } from "store/notifications/actions";
import {
  addConversionRatesError,
  addConversionRatesSuccess,
  editConversionRatesError,
  editConversionRatesSuccess,
  fetchConversionRatesError,
  fetchConversionRatesSuccess
} from "./actions";
import {
  ADD_CONVERSION_RATES_START,
  EDIT_CONVERSION_RATES_START,
  FETCH_CONVERSION_RATES_START
} from "./actionTypes";

function* fetchConversionRates(params) {
  try {
    const data = yield call(conversionRateApi.getConversionRates, params);
    yield put(fetchConversionRatesSuccess(data));
  }
  catch (error) {
    yield put(fetchConversionRatesError(error));
  }
}

function* addConversionRate(params) {
  try {
    const data = yield call(conversionRateApi.addConversionRate, params);
    yield put(addConversionRatesSuccess(data));
    yield put(showSuccessNotification("Team added successfully!"));
  }
  catch (error) {
    yield put(showErrorNotification("Failed to add conversion rate!"));
    yield put(addConversionRatesError(error));
  }
}

function* editConversionRate(params) {
  try {
    const data = yield call(conversionRateApi.editConversionRate, params);
    yield put(editConversionRatesSuccess(data));
    yield put(showSuccessNotification("Conversion rate updated successfully!"));
  }
  catch (error) {
    yield put(showErrorNotification("Failed to update!"));
    yield put(editConversionRatesError(error));
  }
}

function* conversionRatesSaga() {
  yield takeEvery(FETCH_CONVERSION_RATES_START, fetchConversionRates);
  yield takeEvery(ADD_CONVERSION_RATES_START, addConversionRate);
  yield takeEvery(EDIT_CONVERSION_RATES_START, editConversionRate);
}

export default conversionRatesSaga;
