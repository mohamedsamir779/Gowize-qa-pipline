import {
  call, put, takeEvery, delay
} from "redux-saga/effects";
import {
  FETCH_WALLET_START,
  CHANGE_STATUS_WALLET_START,
  FETCH_CLIENT_WALLETS_REQUESTED,
  ADD_CLIENT_WALLET_REQUESTED,
  CONVERT_WALLET_START
} from "./actionTypes";
import {
  fetchWalletSuccess,
  fetchClientWalletsSuccess,
  fetchClientWalletsFail,
  addWalletSuccess, 
  changeStatusDone,
  addWalletFail,
  addWalletClear,
  convertWalletError,
  errorClear
} from "./action";
import * as walletApi from "apis/wallet";
import { showErrorNotification, showSuccessNotification } from "store/notifications/actions";

function* fetchWallet(params) {
  const wallets = yield call(walletApi.getWallets, params);
  yield put(fetchWalletSuccess(wallets));
}

function* fetchClientWallet(params) {
  try {
    const data = yield call(walletApi.getClientWalletDetails, params);
    yield put(fetchClientWalletsSuccess(data));
  } catch (error) {
    yield put(fetchClientWalletsFail({ error: error.message }));
  }
}

function* addClientWallet(params) {
  try {
    const data = yield call(walletApi.addNewWallet, params);
    yield put(addWalletSuccess(data));
    yield put(showSuccessNotification("Wallet Added successfully"));
  } catch (error) {
    yield put(showErrorNotification(error.message));
    yield put(addWalletFail({ error: error.message }));
  }
}
function* changeStatusWallet(params) { 
  try {
    const data = yield call(walletApi.changeStatusWallet, params);
    const { result } = data;
    yield put(changeStatusDone({
      result,
      id: params.payload.id,
      index: params.payload.index,

    }));
    yield put(showSuccessNotification("Wallet Status Changed successfully"));

  }
  catch (error) {
    yield put(changeStatusDone({
      error: error.message,
      index: params.payload.index,
    }));
    yield put(showErrorNotification(error.message));

  }

}
function * convertWallet({ payload }){
  try {
    const data = yield call(walletApi.convertWallet, payload);
    const { status } = data;
    if (status){
      yield put(showSuccessNotification(`${payload.fromAsset} has been converted to ${payload.toAsset} successfully`));
    }
  } catch (error){
  
    yield put(convertWalletError(error.message));
    yield delay(1000);
    yield put(errorClear());
  }
}
function* walletSaga() {
  yield takeEvery(FETCH_WALLET_START, fetchWallet);
  yield takeEvery(FETCH_CLIENT_WALLETS_REQUESTED, fetchClientWallet);
  yield takeEvery(ADD_CLIENT_WALLET_REQUESTED, addClientWallet);
  yield takeEvery(CHANGE_STATUS_WALLET_START, changeStatusWallet);
  yield takeEvery(CONVERT_WALLET_START, convertWallet);
}

export default walletSaga;