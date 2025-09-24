import { CONVERT_START, PREVIEW_CONVERSION_START } from "./actionTypes";
import {
  takeEvery, call, fork, all, put, delay 
} from "redux-saga/effects";
import { convertAPI, previewConversionAPI } from "apis/convert";
import {
  convertFailure, convertSuccess, previewConversionSuccess 
} from "./actions";
import { showErrorNotification, showSuccessNotification } from "store/general/notifications/actions";
import { toggleCurrentModal } from "store/actions";

function* ConvertStart({ payload }) {
  try {
    const result = yield call(convertAPI, { payload });
    yield put(convertSuccess(result.message));
    yield put(showSuccessNotification(`Converted from ${payload.fromAsset} to ${payload.toAsset} successfully`));
    yield delay(1000);
    yield put(toggleCurrentModal(""));
  } catch (error) {
    yield put(showErrorNotification(error.message));
    yield put(convertFailure(error.message));
  }
}
function* PreviewConversionStart({ payload }) {
  try {
    const result = yield call(previewConversionAPI,  payload );
    yield put(previewConversionSuccess(result));
  } catch (error) {
    yield put(showErrorNotification(error.message));
  }
}
function* watchConvert() {
  yield takeEvery(CONVERT_START, ConvertStart);
  yield takeEvery(PREVIEW_CONVERSION_START, PreviewConversionStart);
}

function* convertSaga() {
  yield all([fork(watchConvert)]);
}

export default convertSaga;