import {
  call, delay, put, takeEvery
} from "redux-saga/effects";
// import login redux states (started or requested)
import {
  FETCH_TRANSACTIONS_PROFITS_START,
} from "./actionTypes";
// import all actions except the login oncs (started or requested)
import {
  fetchTransactionsProfitsSuccess
} from "./actions";
import { getTransactionsProfitsAPI } from "../../apis/transactionsProfits";
  
function * fetchTransactions(params){
  try {
    const data = yield call(getTransactionsProfitsAPI, params);
    yield put(fetchTransactionsProfitsSuccess(data));
  } catch (error){
    // yield put(fetchOrdersFail(error));
  }
}
  
function * transactionsProfitsSaga(){
  yield takeEvery(FETCH_TRANSACTIONS_PROFITS_START, fetchTransactions); 
}
  
export default transactionsProfitsSaga;