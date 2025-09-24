import {
  call,
  put,
  takeEvery,
  delay
} from "redux-saga/effects";
import {
  FETCH_CLIENT_TRANSACTIONS_START,
} from "./actionTypes";
import {
  fetchClientTransactionsEnd
} from "./action";
import * as transApis from "apis/transactions";

function * fetchTransactions(params){
  try {
    const data = yield call(transApis.getClientTransactions, params);
    yield put(fetchClientTransactionsEnd({ data }));
  } catch (error){
    yield put(fetchClientTransactionsEnd({ error }));
  }
  
}


function * depositSaga(){
  yield takeEvery(FETCH_CLIENT_TRANSACTIONS_START, fetchTransactions);
}
export default depositSaga;