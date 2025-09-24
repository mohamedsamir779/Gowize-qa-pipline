import {
  getIbTransactionsAPI, internaltransferAPI
} from "apis/forex/ib";
import { addWithdrawalAPI, fetchWithdrawalGatewaysAPI } from "apis/forex/transactions";

import {
  put, call,  takeLatest, 
} from "redux-saga/effects";
import { showErrorNotification, showSuccessNotification } from "store/general/notifications/actions";
import {
  addWithdrawalFail, 
  addWithdrawalSuccess, 
  fetchWithdrawalsGatewaysSuccess,
  ibInternalTransferFailed
} from "./actions";
import {
  GET_IB_DEPOSITS_SUCCCESS, GET_IB_WITHDRAWS_SUCCCESS,
  GET_IB_DEPOSITS_START, GET_IB_WITHDRAWS_START,
  IB_INTERNAL_TRANSFER_START, IB_INTERNAL_TRANSFER_SUCCESS,
  FETCH_WITHDRAWALS_GATEWAYS_START, ADD_WITHDRAWAL_REQUESTED 
} from "./actionTypes";

function * fetchWithdrawalGateways(params = {}){
  try {
    const gateways = yield call(fetchWithdrawalGatewaysAPI, params);
    yield put(fetchWithdrawalsGatewaysSuccess(gateways));
  } catch (error ){}
}
function * addWithdrawal(params){
  try {
    const data = yield call(addWithdrawalAPI, params);
    yield put(addWithdrawalSuccess(data));
    yield put(showSuccessNotification("Withdrawal Added Successfully"));
  } catch (err){
    yield put(addWithdrawalFail(err.message));
    yield put(showErrorNotification(err.message));  }
}

function* getTransactions({ payload }) {
  const { result } = yield call(getIbTransactionsAPI, payload);
  if (payload.type === "DEPOSIT")
    yield put({
      type: GET_IB_DEPOSITS_SUCCCESS,
      payload: result 
    });
  if (payload.type === "WITHDRAW")
    yield put({
      type: GET_IB_WITHDRAWS_SUCCCESS,
      payload: result 
    });
}

function* ibInternalTransfer({ payload }) {
  try {
    const { result } = yield call(internaltransferAPI, payload);
    if (result && result.status === "APPROVED"){
      yield put({
        type: IB_INTERNAL_TRANSFER_SUCCESS
      });
      yield put(showSuccessNotification("Transfered done successfully"));
    }
  } catch (error) {
    yield put(ibInternalTransferFailed(error));
    yield put(showErrorNotification(error.message));
  }
}

function* transactionsSaga() {
  yield takeLatest(FETCH_WITHDRAWALS_GATEWAYS_START, fetchWithdrawalGateways);
  yield takeLatest(ADD_WITHDRAWAL_REQUESTED, addWithdrawal);
  yield takeLatest(GET_IB_DEPOSITS_START, getTransactions);
  yield takeLatest(GET_IB_WITHDRAWS_START, getTransactions);
  yield takeLatest(IB_INTERNAL_TRANSFER_START, ibInternalTransfer);
}
    
export default transactionsSaga;
