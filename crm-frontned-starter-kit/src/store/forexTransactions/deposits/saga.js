import {
  call,
  put,
  takeEvery,
  delay
} from "redux-saga/effects";
import { 
  FETCH_FOREX_DEPOSITS_REQUESTED,
  ADD_FOREX_DEPOSIT_REQUESTED,
  APPROVE_FOREX_DEPOSIT,
  APPROVE_FOREX_DEPOSIT_SUCCESS,
  REJECT_FOREX_DEPOSIT,
  REJECT_FOREX_DEPOSIT_SUCCESS
} from "./actionTypes";
import {
  fetchForexDepositsSuccess,
  fetchForexDepositsFail,

  addForexDepositSuccess,
  addForexDepositFail,
  addForexDepositClear,
  addForexDepositErrorClear
} from "./actions";
import * as forexDepositApis from "apis/forexDeposit";
import {
  approveFxDepositAPI
} from "apis/deposit";
import { showErrorNotification, showSuccessNotification } from "store/notifications/actions";

function * fetchForexDeposits(params){
  try {
    const data = yield call(forexDepositApis.getForexDeposits, params);
    yield put(fetchForexDepositsSuccess(data));
  } catch (err){
    yield put(fetchForexDepositsFail(err.message));
  }
}

function * addForexDeposit(params){
  try {
    const data = yield call(forexDepositApis.postForexDeposit, params);
    yield put(addForexDepositSuccess(data));
    yield put(showSuccessNotification("Deposit Added Successfully"));
    yield put(addForexDepositClear());
  } catch (err){
    yield put(addForexDepositFail(err.message));
    yield delay(5000);
    yield put(addForexDepositErrorClear());
  }
}
function * approveFxDeposit({ payload:{ id, customerId } }) {
  try {
    const res = yield call(approveFxDepositAPI, id, customerId);
    if (res.status){
      yield put({
        type: APPROVE_FOREX_DEPOSIT_SUCCESS,
        payload: id 
      });
    }
    yield put(showSuccessNotification("Forex Deposit approved successfully"));
  } catch (error) {
    yield put(showErrorNotification(error.message));
  }
}

function * rejectFxDeposit({ payload:{ id, customerId } }) {
  try {
    const res = yield call(forexDepositApis.rejectFxDeposit, id, customerId);
    if (res.status){
      yield put({
        type: REJECT_FOREX_DEPOSIT_SUCCESS,
        payload: id 
      });
    }
    yield put(showSuccessNotification("Forex Deposit rejected successfully"));
  } catch (error) {
    yield put(showErrorNotification(error.message));
  }
}

function * forexDepositSaga(){
  yield takeEvery(FETCH_FOREX_DEPOSITS_REQUESTED, fetchForexDeposits);
  yield takeEvery(ADD_FOREX_DEPOSIT_REQUESTED, addForexDeposit);
  yield takeEvery(APPROVE_FOREX_DEPOSIT, approveFxDeposit);
  yield takeEvery(REJECT_FOREX_DEPOSIT, rejectFxDeposit);
}
export default forexDepositSaga;