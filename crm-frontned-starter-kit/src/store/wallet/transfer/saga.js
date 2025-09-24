import {
  call,
  put,
  takeEvery
} from "redux-saga/effects";
import {
  approveWalletTransferError,
  approveWalletTransferSuccess,
  fetchWalletTransferError,
  fetchWalletTransferSuccess,
  rejectWalletTransferError,
  rejectWalletTransferSuccess
} from "./actions";
import {
  APPROVE_WALLET_TRANSFER_START,
  FETCH_WALLET_TRANSFER_START,
  REJECT_WALLET_TRANSFER_START
} from "./actionTypes";
import { showErrorNotification, showSuccessNotification } from "store/notifications/actions";
import {
  getWalletTransfers,
  approveTransfer,
  rejectTransfer,
} from "apis/wallet";

function* fetchWalletTransfer({ payload }) {
  try {
    const response = yield call(getWalletTransfers, payload);
    yield put(fetchWalletTransferSuccess(response?.result));
  } catch (error) {
    yield put(fetchWalletTransferError(error));
  }
}

function* approveWalletTransfer({ payload }) {
  try {
    console.log(payload);
    const response = yield call(approveTransfer, payload);
    yield put(approveWalletTransferSuccess(response));
    yield put(showSuccessNotification("Wallet Transfer approved successfully"));
  } catch (error) {
    yield put(approveWalletTransferError(error));
    yield put(showErrorNotification("Wallet Transfer approved failed"));
  }
}

function* rejectWalletTransfer({ payload }) {
  try {

    const response = yield call(rejectTransfer, payload);
    yield put(rejectWalletTransferSuccess(response));
    yield put(showSuccessNotification("Wallet Transfer rejected successfully"));
  } catch (error) {
    yield put(rejectWalletTransferError(error));
    yield put(showErrorNotification("Wallet Transfer rejected failed"));
  }
}

function* transferSaga() {
  yield takeEvery(FETCH_WALLET_TRANSFER_START, fetchWalletTransfer);
  yield takeEvery(APPROVE_WALLET_TRANSFER_START, approveWalletTransfer);
  yield takeEvery(REJECT_WALLET_TRANSFER_START, rejectWalletTransfer);
}

export default transferSaga;
