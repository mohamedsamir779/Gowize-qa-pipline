import {
  call, put, takeEvery
} from "redux-saga/effects";
import * as bank from "apis/companyBankAccount";
import {
  fetchClientBankAccountSuccess,
  fetchClientBankAccountFail,

  addBankAccountSuccess,
  addBankAccountFail,
  addBankAccountClear,
  
  deleteBankAccountSuccess,
  deleteBankAccountFail,
    
  editBankAccountSuccess,
  editBankAccountFail,
  editBankAccountClear
} from "./actions";
import {
  FETCH_COMPANY_BANK_ACCOUNT_REQUESTED,
  ADD_COMPANY_BANK_ACCOUNT_REQUESTED,
  DELETE_COMPANY_BANK_ACCOUNT_REQUESTED,
  EDIT_COMPANY_BANK_ACCOUNT_REQUESTED
} from "./actionTypes";
import { showSuccessNotification } from "store/notifications/actions";
 
function * fetchClientBankAccount(params){
  try {
    const data = yield call(bank.getDetails, params);
    yield put (fetchClientBankAccountSuccess(data));
  } catch (error){
    yield put(fetchClientBankAccountFail({ error: error.message }));
  }
}

function * addBankAccount(params){
  try {
    const data = yield call(bank.postAccount, params);
    const { result } = data;
    yield put(addBankAccountSuccess(result));
    yield put(showSuccessNotification("Bank account created successfully"));
    yield put(addBankAccountClear());
  } catch (error){
    yield put(addBankAccountFail({ error: error.message }));
  }
}
  
function * deleteBankAccount(params){
  try {
    const data = yield call(bank.deleteAccount, params);
    yield put(deleteBankAccountSuccess(data));
  } catch (error){
    yield put(deleteBankAccountFail({ error: error.message }));
  }
}
  
function * editBankAccount(params){
  try {
    const data = yield call(bank.updateAccount, params);
    yield put(editBankAccountSuccess(data));
    yield put(showSuccessNotification("Bank account updated successfully"));
    yield put(editBankAccountClear());
  } catch (error){
    yield put(editBankAccountFail({ error: error.message }));
  }
}
  
function * bankSaga() {
  yield takeEvery(FETCH_COMPANY_BANK_ACCOUNT_REQUESTED, fetchClientBankAccount);
  yield takeEvery(ADD_COMPANY_BANK_ACCOUNT_REQUESTED, addBankAccount);
  yield takeEvery(DELETE_COMPANY_BANK_ACCOUNT_REQUESTED, deleteBankAccount);
  yield takeEvery(EDIT_COMPANY_BANK_ACCOUNT_REQUESTED, editBankAccount);
}
  
export default bankSaga;