import {
  call,
  put,
  takeEvery,
  delay
} from "redux-saga/effects";
import { 
  FETCH_CREDITS_REQUESTED,
  ADD_CREDIT_REQUESTED
} from "./actionTypes";
import {
  fetchCreditsSuccess,
  fetchCreditsFail,

  addCreditSuccess,
  addCreditFail,
  addCreditClear,
  addCreditErrorClear
} from "./actions";
import * as creditApis from "apis/credit";
import { showErrorNotification, showSuccessNotification } from "store/notifications/actions";

function * fetchCredits(params){
  try {
    const data = yield call(creditApis.getCredits, params);
    yield put(fetchCreditsSuccess(data));
  } catch (err){
    yield put(fetchCreditsFail(err.message));
  }
}

function * addCredit(params){
  try {
    const data = yield call(creditApis.postCredit, params);
    yield put(addCreditSuccess(data));
    yield put(showSuccessNotification("Credit Added Successfully"));
    yield put(addCreditClear());
  } catch (err){
    yield put(addCreditFail(err.message));
    yield put(showErrorNotification(err.message));
    yield delay(5000);
    yield put(addCreditErrorClear());
  }
}

function * creditSaga(){
  yield takeEvery(FETCH_CREDITS_REQUESTED, fetchCredits);
  yield takeEvery(ADD_CREDIT_REQUESTED, addCredit);
}
export default creditSaga;