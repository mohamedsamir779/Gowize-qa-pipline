import {
  call,
  put,
  takeEvery,
  delay
} from "redux-saga/effects";
import { 
  ADD_DEPOSIT_START, 
  FETCH_DEPOSITS_START, 
  DEPOSIT_APPROVE, 
  DEPOSIT_REJECT, 

  FETCH_CLIENT_DEPOSITS_REQUESTED,
} from "./actionTypes";
import {
  addDepositSuccess, 
  depositError, 
  fetchDepositsSuccess, 
  modalClear, 
  transactionStateChange,
  transactionStateChangeFail,

  fetchClientDepositsSuccess,
  fetchClientDepositsFail,
  errorClear,
} from "./action";
import {
  makeDeposit, 
  getDeposits, 
  aprroveDeposit, 
  rejectDeposit,
  getClientDeposits,
} from "apis/deposit";
import { showSuccessNotification, showErrorNotification } from "store/notifications/actions";

function * fetchDeposits(params){
  try {
    const data = yield call(getDeposits, params);
    yield put(fetchDepositsSuccess(data));
  } catch (error){
    yield put(depositError("Error happened during fetching data"));
  }
  
}

function * addDeposit({ payload:{ deposit } }){
  try {
    const data = yield call(makeDeposit, deposit);
    const { status, result } = data;
    if (status === true){
      yield put(addDepositSuccess(result));
      yield put(modalClear());
      yield put(showSuccessNotification(`Deposit has been ${result.status}`));
    }
  } catch (error){
    yield put(depositError(error));
    yield delay(5000);
    yield put(errorClear());
  } 
}

function* depositApprove({ payload:{ id, customerId } }){
  try  {
    const  data = yield call(aprroveDeposit, id, customerId);
    const { result } = data;
    yield put(transactionStateChange(result));
    yield put(showSuccessNotification("Deposit has been approved successfully"));
  } catch (error){
    yield put(transactionStateChangeFail(error.message));
    yield put(showErrorNotification(error.message));
  }
}

function * depositReject({ payload:{ id, customerId } }){
  try {
    const data = yield call(rejectDeposit, id, customerId);
    const { result } = data;
    yield put(transactionStateChange(result));
    yield put(showSuccessNotification("Deposit has been rejected successfully"));
  } catch (error){
    yield put(transactionStateChangeFail(error.message));
    yield put(showErrorNotification(error.message));
  }
}

function * fetchClientDeposits(params){
  try {
    const data = yield call(getClientDeposits, params);
    yield put(fetchClientDepositsSuccess(data));
  } catch (error){ 
    yield put(fetchClientDepositsFail({ error: error.message }));
  }
}

function * depositSaga(){
  yield takeEvery(FETCH_DEPOSITS_START, fetchDeposits);
  yield takeEvery(ADD_DEPOSIT_START, addDeposit);
  yield takeEvery(DEPOSIT_REJECT, depositReject);
  yield takeEvery(DEPOSIT_APPROVE, depositApprove);
  yield takeEvery(FETCH_CLIENT_DEPOSITS_REQUESTED, fetchClientDeposits);
}
export default depositSaga;