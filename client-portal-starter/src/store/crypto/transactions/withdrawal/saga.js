import {
  call,
  put,
  takeEvery
} from "redux-saga/effects";

import { getWithdrawals } from "apis/transactions";
import { FETCH_CLIENT_WITHDRAWALS_REQUESTED } from "./actionTypes";
import { fetchClientWithdrawalsSuccess, fetchClientWithdrawalsFail } from "./actions";
  
function * fetchClientWithdrawals(params){
  try {
    const data = yield call(getWithdrawals, params.payload);
    yield put(fetchClientWithdrawalsSuccess(data));
  } catch (error){ 
    yield put(fetchClientWithdrawalsFail({ error: error.message }));
  }
}
  
function * withdrawalSaga(){
  yield takeEvery( FETCH_CLIENT_WITHDRAWALS_REQUESTED, fetchClientWithdrawals);
}

export default withdrawalSaga;