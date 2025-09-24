import {
  call, put, takeEvery
} from "redux-saga/effects";
// Login Redux States
import {
  FETCH_ACCOUNT_TYPES_START,
  // FETCH_TRADING_ACCOUNT_START,
  FETCH_TRADING_ACCOUNTS_START,
  CREATE_TRADING_ACCOUNT_START,
  FETCH_TRADING_ACCOUNT_BY_LOGIN_REQUESTED,
  FETCH_TRADING_ACCOUNTS_BY_CUSTOMERID_REQUESTED,
  UPDATE_LEVERAGE_START,
  UPDATE_PASSWORD_START,
  LINK_TRADING_ACCOUNT_START,
  UPDATE_TYPE_START,
  CHANGE_ACCESS_START,
  GET_OPEN_POSITIONS_START,
  GET_CLOSE_POSITIONS_START,
  ADD_ACCOUNT_TYPE_START,
  UPDATE_ACCOUNT_TYPE_START
} from "./actionTypes";

import {
  fetchAccountTypesEnd,
  createAccountClear,
  createTradingAccountEnd,
  fetchTradingAccountByCustomerIdSuccess,
  fetchTradingAccountByCustomerIdFail,
  fetchTradingAccountByLoginSuccess,
  fetchTradingAccountByLoginFail,
  fetchTradingAccountsEnd,
  updateLeverageSuccess,
  updateLeverageFail,
  updatePasswordSuccess,
  updatePasswordFail,
  updateTypeSuccess,
  updateTypeFail,
  changeAccessSuccess,
  changeAccessFail,
  getOpenPositionsSuccess,
  getClosePositionsSuccess,
  addAccountTypeFail,
  addAccountTypeSuccess,
  updateAccountTypeFail,
  updateAccountTypeSuccess
} from "./actions";
import { showErrorNotification, showSuccessNotification } from "store/notifications/actions";

//Include Both Helper File with needed methods
import * as accountsApi from "../../apis/tradingAccounts";

function * fetchTradingAccountsByLogin(params){
  try {
    const data = yield call(accountsApi.getTradingAccountByLogin, params);
    yield put(fetchTradingAccountByLoginSuccess(data));
  } catch (err){
    yield put(fetchTradingAccountByLoginFail(err.message));
  }
}

function * fetchTradingAccountsByCustomerId(params){
  try {
    const data = yield call(accountsApi.getTradingAccountByCustomerId, params);
    yield put(fetchTradingAccountByCustomerIdSuccess(data));
  } catch (err){
    yield put(fetchTradingAccountByCustomerIdFail(err.message));
  }
}

function * fetchAccountTypes(params){
  try {
    const data = yield call(accountsApi.getAccountTypes, params);    
    yield put(fetchAccountTypesEnd({ data }));
  }
  catch (error){
    yield put(fetchAccountTypesEnd({ error }));
  } 
}

function * createAccountType(params){
  try {
    const data = yield call(accountsApi.createAccountType, params);    
    yield put(addAccountTypeSuccess({ data }));
    yield put(showSuccessNotification("Account type added successfully."));
  }
  catch (error){
    yield put(addAccountTypeFail({ error }));
    yield put(showErrorNotification(error.message || "Failed to add account type."));
  } 
}

function * updateAccountType(params){
  try {
    const data = yield call(accountsApi.updateAccountType, params);
    yield call(fetchAccountTypes, {});
    yield put(updateAccountTypeSuccess({ data }));
    yield put(showSuccessNotification("Account type updated successfully."));
  }
  catch (error){
    yield put(updateAccountTypeFail({ error }));
    yield put(showErrorNotification(error.message || "Failed to update account type."));
  }
}

function * fetchTradingAccounts(params){
  try {
    const data = yield call(accountsApi.getTradingAccounts, params);
    yield put(fetchTradingAccountsEnd(data));
  } catch (err){
    yield put(fetchTradingAccountsEnd(err.message));
  }
}

function * createTradingAccount(params){
  try {
    const data = yield call(accountsApi.createTradingAccount, params);    
    yield put(createTradingAccountEnd({ data }));
    yield put(createAccountClear());
    yield put(showSuccessNotification("Trading account created."));
  }
  catch (error){
    yield put(createTradingAccountEnd({ error }));
    yield put(showErrorNotification(error.message || "Failed to create trading account"));
  } 
}

function * linkTradingAccount(params){
  try {
    const data = yield call(accountsApi.linkTradingAccount, params);    
    yield put(createTradingAccountEnd({ data }));
    yield put(createAccountClear());
    yield put(showSuccessNotification("Trading account linked"));
  }
  catch (error){
    yield put(createTradingAccountEnd({ error }));
    yield put(showErrorNotification(error.message || "Failed to create trading account"));
  } 
}

function* updateLeverage({ payload }) {
  try {
    const data = yield call(accountsApi.updateLeverageAPI, payload);
    const { result, status } = data;
    if (status) {
      yield put(updateLeverageSuccess(result));
      yield put(showSuccessNotification("Leverage changed successfully!"));
    } else {
      yield put(updateLeverageFail(data.message));
      yield put(showErrorNotification(data.message));
    }
  } catch (error) {
    yield put(updateLeverageFail(error.message));
    yield put(showErrorNotification(error.message));
  }
}

function* updatePassword({ payload }) {
  try {
    const data = yield call(accountsApi.updatePasswordAPI, payload);
    const { result, status } = data;
    if (status) {
      yield put(updatePasswordSuccess(result));
      yield put(showSuccessNotification("Password changed successfully!"));
    }
  } catch (error) {
    yield put(updatePasswordFail(error.message));
    yield put(showErrorNotification(error.message));
  }
}

function* updateType(payload) {
  try {
    const data = yield call(accountsApi.updateTypeAPI, payload);
    const { result, status } = data;
    if (status) {
      yield put(updateTypeSuccess(result));
      yield put(showSuccessNotification("Type changed successfully!"));
    } else {
      yield put(updateTypeFail(data.message));
      yield put(showErrorNotification(data.message));
    }
  } catch (error) {
    yield put(updateTypeFail(error.message));
    yield put(showErrorNotification(error.message));
  }
}

function* ChangeAccess(payload) {
  try {
    const data = yield call(accountsApi.changeAccessAPI, payload);
    const { result, status } = data;
    if (status) {
      yield put(changeAccessSuccess(result));
      yield put(showSuccessNotification("Access changed successfully!"));
    } else {
      yield put(showErrorNotification(data.message));
      yield put(changeAccessFail(data.message));
    }
  } catch (error) {
    yield put(changeAccessFail(error.message));
    yield put(showErrorNotification(error.message));
  }
}

function* fetchOpenPositions({ payload }) {
  try {
    const data = yield call(accountsApi.getOpenPositionsAPI, payload);
    const { result, status } = data;
    if (status) {
      yield put(getOpenPositionsSuccess(result));
    }
  } catch (error) { }
}
function* fetchClosePositions({ payload }) {
  try {
    const data = yield call(accountsApi.getClosePositionsAPI, payload);
    const { result, status } = data;
    if (status) {
      yield put(getClosePositionsSuccess(result));
    }
  } catch (error) { }
}

function * tradingAccountSaga(){
  yield takeEvery(FETCH_TRADING_ACCOUNT_BY_LOGIN_REQUESTED, fetchTradingAccountsByLogin);
  yield takeEvery(FETCH_TRADING_ACCOUNTS_BY_CUSTOMERID_REQUESTED, fetchTradingAccountsByCustomerId);
  yield takeEvery(FETCH_ACCOUNT_TYPES_START, fetchAccountTypes);
  yield takeEvery(ADD_ACCOUNT_TYPE_START, createAccountType);
  yield takeEvery(UPDATE_ACCOUNT_TYPE_START, updateAccountType);
  yield takeEvery(FETCH_TRADING_ACCOUNTS_START, fetchTradingAccounts);
  yield takeEvery(CREATE_TRADING_ACCOUNT_START, createTradingAccount);
  yield takeEvery(LINK_TRADING_ACCOUNT_START, linkTradingAccount);
  yield takeEvery(UPDATE_LEVERAGE_START, updateLeverage);
  yield takeEvery(UPDATE_PASSWORD_START, updatePassword);
  yield takeEvery(UPDATE_TYPE_START, updateType);
  yield takeEvery(CHANGE_ACCESS_START, ChangeAccess);
  yield takeEvery(GET_OPEN_POSITIONS_START, fetchOpenPositions);
  yield takeEvery(GET_CLOSE_POSITIONS_START, fetchClosePositions);
}

export default tradingAccountSaga;
