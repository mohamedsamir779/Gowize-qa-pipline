import {
  call,
  put,
  takeEvery,
  delay
} from "redux-saga/effects";
import { 
  FETCH_FOREX_WITHDRAWALS_REQUESTED,
  ADD_FOREX_WITHDRAWAL_REQUESTED,
  APPROVE_FOREX_WITHDRAWAL,
  APPROVE_FOREX_WITHDRAWAL_SUCCESS,
  REJECT_FOREX_WITHDRAWAL,
  REJECT_FOREX_WITHDRAWAL_SUCCESS
} from "./actionTypes";
import {
  fetchForexWithdrawalsSuccess,
  fetchForexWithdrawalsFail,

  addForexWithdrawalSuccess,
  addForexWithdrawalFail,
  addForexWithdrawalClear,
  addForexWithdrawalErrorClear,
} from "./actions";
import * as forexWithdrawalApis from "apis/forexWithdrawal";
import { showErrorNotification, showSuccessNotification } from "store/notifications/actions";

function * fetchForexWithdrawals(params){
  try {
    const data = yield call(forexWithdrawalApis.getForexWithdrawals, params);
    yield put(fetchForexWithdrawalsSuccess(data));
  } catch (err){
    yield put(fetchForexWithdrawalsFail(err.message));
  }
}

function * addForexWithdrawal(params){
  try {
    const data = yield call(forexWithdrawalApis.postForexWithdrawal, params);
    yield put(addForexWithdrawalSuccess(data));
    yield put(showSuccessNotification("Withdrawal Added Successfully"));
    yield put(addForexWithdrawalClear());
  } catch (err){
    yield put(addForexWithdrawalFail(err.message));
    yield put(showErrorNotification(err.message));
    yield delay(5000);
    yield put(addForexWithdrawalErrorClear());
  }
}
function * approveForexWithdrawal({ payload:{ id, customerId } }) {
  try {
    const res = yield call(forexWithdrawalApis.approveForexWithdrawal, id, customerId);
    if (res.status){
      yield put({
        type:APPROVE_FOREX_WITHDRAWAL_SUCCESS,
        payload:id 
      });
    }
    yield put(showSuccessNotification("Forex Withdraw approved successfully"));
  } catch (error) {
    yield put(showErrorNotification(error.message));
  }
}
function * rejectForexWithdrawal({ payload:{ id, customerId } }) {
  try {
    const res = yield call(forexWithdrawalApis.rejectForexWithdrawal, id, customerId);
    if (res.status){
      yield put({
        type:REJECT_FOREX_WITHDRAWAL_SUCCESS,
        payload:id 
      });
    }
    yield put(showSuccessNotification("Forex Withdraw rejected successfully"));
  } catch (error) {
    yield put(showErrorNotification(error.message));
  }
}
function * forexWithdrawalSaga(){
  yield takeEvery(FETCH_FOREX_WITHDRAWALS_REQUESTED, fetchForexWithdrawals);
  yield takeEvery(ADD_FOREX_WITHDRAWAL_REQUESTED, addForexWithdrawal);
  yield takeEvery(APPROVE_FOREX_WITHDRAWAL, approveForexWithdrawal);
  yield takeEvery(REJECT_FOREX_WITHDRAWAL, rejectForexWithdrawal);
}
export default forexWithdrawalSaga;