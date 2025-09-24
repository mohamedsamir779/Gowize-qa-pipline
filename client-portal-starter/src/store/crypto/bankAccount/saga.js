import {
  takeEvery,
  fork,
  put,
  all,
  call
} from "redux-saga/effects";
import { FETCH_BANK_ACCOUNTS_START } from "./actionTypes";
import {
  fetchBankAccountsAPI,
  // updateBankAccount 
} from "../../../apis/bankAccounts";
import {
  fetchBankAccountsFailed,
  fetchBankAccountsSuccess
} from "./actions";

function* fetchbankAccounts(params) {
  try {
    const result = yield call(fetchBankAccountsAPI, params);
    yield put(fetchBankAccountsSuccess(result));
  } catch (error) {
    yield put(fetchBankAccountsFailed(error));
  }
}


// function * editBankAccount({ payload }){
//   try {
//     yield call(updateBankAccount, payload); 
//     const { body, id } = payload;
//     yield put(showSuccessNotification({
//       _id:id, 
//       ...body
//     })); 
//   } catch (error){

//     yield put(showErrorNotification(error));
//     // yield delay(2000);
//     // yield put(apiError(""));
//   }
// }

function* WatchbankAccounts() {
  yield takeEvery(FETCH_BANK_ACCOUNTS_START, fetchbankAccounts);
}
function* bankAccountsSaga() {
  yield all([fork(WatchbankAccounts)]);
}

export default bankAccountsSaga;
