import {
  call, put, takeEvery, takeLatest
} from "redux-saga/effects";
import {
  getAccountsAPI, createAccountAPI, getAccountTypesAPI,
  updateLeverageAPI, updatePasswordAPI,
  getOpenPositionsAPI, getClosePositionsAPI,
  getTransfersAPI,
  createInternalTransferAPI,
} from "../../../apis/forex/accounts";
import {
  getAccountsSuccess,
  createAccountSuccess, createAccountFail,
  getAccountTypesSuccess,
  updateLeverageSuccess, updateLeverageFail,
  updatePasswordSuccess, updatePasswordFail,
  getOpenPositionsSuccess, getClosePositionsSuccess,
  getTransfersSuccess,
  createInternalTransferSuccess,
  createInternalTransferFail,
  createAccountRequestSuccess,
} from "./actions";

import {
  GET_ACCOUNTS_START, CREATE_ACCOUNT_START, GET_ACCOUNT_TYPES_START,
  UPDATE_LEVERAGE_START, UPDATE_PASSWORD_START,
  GET_OPEN_POSITIONS_START, GET_CLOSE_POSITIONS_START,
  GET_TRANSFERS_START,
  CREATE_INTERNAL_TRANSFER_START,
  CREATE_ACCOUNT_REQUEST_START,
} from "./actionTypes";

import {
  showErrorNotification,
  showSuccessNotification,
} from "../../general/notifications/actions";
import { fetchProfile, toggleCurrentModal } from "store/actions";
import { createAccountRequestAPI } from "apis/forex/requests";

function* fetchAccounts({ payload }) {
  try {
    const data = yield call(getAccountsAPI, payload);
    const { result, status } = data;
    if (status) {
      yield put(getAccountsSuccess(result));
    }
  } catch (error) { }
}
function* createAccount({ payload }) {
  try {
    const result = yield call(createAccountAPI, payload);
    if (result.status) {
      yield put(createAccountSuccess(result));
      //for updating open account journey
      // if (result?.result?.accountTypeId?.type === "LIVE" && !result?.result?.customer?.stages?.openAccount)
      //   yield put(updateProfileJourney({
      //     ...result,
      //     stages:{
      //       openAccount: true
      //     }
      //   }));
      yield put(fetchProfile());
      yield put(showSuccessNotification("Account created successfully!"));
      yield put(toggleCurrentModal(""));
    } else {
      yield put(createAccountFail(result.message));
      yield put(showErrorNotification(result.message));  
    }
  }
  catch (error) {
    yield put(createAccountFail(error.message));
    yield put(showErrorNotification(error.message));
  }
}
function* createAccountRequest({ payload }) {
  try {
    const result = yield call(createAccountRequestAPI, payload);
    if (result.status) {
      yield put(createAccountRequestSuccess(result));
      yield put(showSuccessNotification("Create Account request was successfully sent!"));
      yield put(toggleCurrentModal(""));
    } else {
      yield put(createAccountFail(result.message));
      yield put(showErrorNotification(result.message));  
    }
  } catch (error) {
    yield put(createAccountFail(error.message));
    yield put(showErrorNotification(error.message));
  }
}
function* fetchAccountTypes({ payload }) {
  try {
    const data = yield call(getAccountTypesAPI, payload);
    const { result, status } = data;
    if (status) {
      yield put(getAccountTypesSuccess(result));
    }
  } catch (error) { }
}
function* updateLeverage({ payload }) {
  try {
    const data = yield call(updateLeverageAPI, payload);
    const { result, status } = data;
    if (status) {
      yield put(updateLeverageSuccess(result));
      yield put(showSuccessNotification("Leverage Updated successfully!"));
      yield put(toggleCurrentModal(""));
    }
  } catch (error) {
    yield put(updateLeverageFail(error.message));
    yield put(showErrorNotification(error.message));
  }
}
function* updatePassword({ payload }) {
  try {
    const data = yield call(updatePasswordAPI, payload);
    const { result, status } = data;
    if (status) {
      yield put(updatePasswordSuccess(result));
      yield put(showSuccessNotification("Password Updated successfully!"));
    }
  } catch (error) {
    yield put(updatePasswordFail(error.message));
    yield put(showErrorNotification(error.message));
  }
}
function* fetchOpenPositions({ payload }) {
  try {
    const data = yield call(getOpenPositionsAPI, payload);
    const { result, status } = data;
    if (status) {
      yield put(getOpenPositionsSuccess(result));
    }
  } catch (error) { }
}
function* fetchClosePositions({ payload }) {
  try {
    const data = yield call(getClosePositionsAPI, payload);
    const { result, status } = data;
    if (status) {
      yield put(getClosePositionsSuccess(result));
    }
  } catch (error) { }
}
function* fetchTransfers({ payload }) {
  try {
    const data = yield call(getTransfersAPI, payload);
    const { result, status } = data;
    if (status) {
      yield put(getTransfersSuccess(result));
    }
  } catch (error) { }
}

function* createInternalTransfer({ payload }) {
  try {
    const data = yield call(createInternalTransferAPI, payload);
    const { result, status } = data;
    if (status) {
      yield put(createInternalTransferSuccess(result));
      yield put(showSuccessNotification("Transfer was successful"));
    } else {
      const { message } = data;
      yield put(createInternalTransferFail(message));
      yield put(showErrorNotification(message));
    }
  } catch (error) {
    yield put(showErrorNotification("Unable to create an internal transfer request. "));
  }
}

function* AccountsSaga() {
  yield takeLatest(CREATE_ACCOUNT_START, createAccount);
  yield takeEvery(GET_ACCOUNTS_START, fetchAccounts);
  yield takeEvery(GET_ACCOUNT_TYPES_START, fetchAccountTypes);
  yield takeLatest(UPDATE_LEVERAGE_START, updateLeverage);
  yield takeLatest(UPDATE_PASSWORD_START, updatePassword);
  yield takeEvery(GET_OPEN_POSITIONS_START, fetchOpenPositions);
  yield takeEvery(GET_CLOSE_POSITIONS_START, fetchClosePositions);
  yield takeEvery(GET_TRANSFERS_START, fetchTransfers);
  yield takeLatest(CREATE_INTERNAL_TRANSFER_START, createInternalTransfer);
  yield takeLatest(CREATE_ACCOUNT_REQUEST_START, createAccountRequest);
}

export default AccountsSaga;
