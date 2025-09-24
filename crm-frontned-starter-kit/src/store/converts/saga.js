import {
  call,
  put,
  takeEvery,
  delay
} from "redux-saga/effects";
import { 
  FETCH_CONVERTS_REQUESTED,
  ADD_CONVERT_REQUESTED
} from "./actionTypes";
import {
  fetchConvertsSuccess,
  fetchConvertsFail,
  addConvertSuccess,
  addConvertFail,
  addConvertClear,
  addConvertErrorClear
} from "./actions";
import * as convertsApis from "apis/converts";
import { showSuccessNotification } from "store/notifications/actions";

function * fetchConverts(params){
  try {
    const data = yield call(convertsApis.getConverts, params);
    yield put(fetchConvertsSuccess(data));
  } catch (err){
    yield put(fetchConvertsFail(err.message));
  }
}

function * addConvert(params){
  try {
    const data = yield call(convertsApis.postConvert, params);
    yield put(addConvertSuccess(data));
    yield put(showSuccessNotification("Convert Added Successfully"));
    yield delay(1000);
    yield put(addConvertClear());
  } catch (err){
    yield put(addConvertFail(err.message));
    yield delay(5000);
    yield put(addConvertErrorClear());
  }
}

function * convertSaga(){
  yield takeEvery(FETCH_CONVERTS_REQUESTED, fetchConverts);
  yield takeEvery(ADD_CONVERT_REQUESTED, addConvert);
}
export default convertSaga;