import {
  call,
  put,
  takeEvery
} from "redux-saga/effects";

import { FETCH_CLIENT_DEPOSITS_REQUESTED } from "./actionTypes";
import { fetchClientDepositsSuccess, fetchClientDepositsFail } from "./actions";
import { getDeposits } from "apis/transactions";

function * fetchClientDeposits(params){
  try {
    const data = yield call(getDeposits, params.payload);
    yield put(fetchClientDepositsSuccess(data));
  } catch (error){ 
    yield put(fetchClientDepositsFail({ error: error.message }));
  }
}
  
function * depositSaga(){
  yield takeEvery(FETCH_CLIENT_DEPOSITS_REQUESTED, fetchClientDeposits);
}
  
export default depositSaga;