import {
  takeEvery, put, call 
} from "redux-saga/effects";
import {
  FETCH_WALLET_REPORT_START,
  FETCH_WALLETS_START,
  IB_WALLET_TRANSFER_START,
  REQUEST_WALLET_FX_TRANSFER_START
} from "./actionTypes";
import {
  fetchWalletsAPI,
  createWalletTransferRequest,
  fetchReportsAPI,
  createIbWalletTransferAPI
} from "../../apis/wallets";
import {
  createIbWalletTransferError,
  createIbWalletTransferSuccess,
  createWalletTransferError,
  createWalletTransferSuccess,
  fetchReportFailed,
  fetchReportSuccess,
  fetchWalletsFailed,
  fetchWalletsSuccess
} from "./actions";
import { showErrorNotification, showSuccessNotification } from "store/general/notifications/actions";

function* fetchWallets(params) {
  try {
    const result = yield call(fetchWalletsAPI, params);
    yield put(fetchWalletsSuccess(result));
  } catch (error) {
    yield put(fetchWalletsFailed(error));
  }
}

function* createWalletRequest({ payload }) {
  try {
    const response = yield call(createWalletTransferRequest, { payload });
    yield put(createWalletTransferSuccess(response));
    yield put(showSuccessNotification("Transfer Request Sent Successfully"));
  } catch (error) {
    yield put(createWalletTransferError(error));
    yield put(showErrorNotification(error?.message || "Something went wrong"));
  }
}

function* createIbWalletTransfer({ payload }) {
  try {
    const response = yield call(createIbWalletTransferAPI, { payload });
    yield put(createIbWalletTransferSuccess(response));
    yield put(showSuccessNotification("Transfer was successful"));
  } catch (error) {
    yield put(createIbWalletTransferError(error));
    yield put(showErrorNotification(error?.message || "Something went wrong"));
  }
}

function* fetchReports({ payload }) {
  try {
    const result = yield call(fetchReportsAPI, payload);
    yield put(fetchReportSuccess(result));
  } catch (error) {
    yield put(fetchReportFailed(error));
  }
}

function* WatchWallets() {
  yield takeEvery(FETCH_WALLETS_START, fetchWallets);
  yield takeEvery(REQUEST_WALLET_FX_TRANSFER_START, createWalletRequest);
  yield takeEvery(IB_WALLET_TRANSFER_START, createIbWalletTransfer);
  yield takeEvery(FETCH_WALLET_REPORT_START, fetchReports);
}


export default WatchWallets;