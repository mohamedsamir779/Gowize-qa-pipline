import {
  call,
  put,
  takeEvery
} from "redux-saga/effects";
import * as historyApi from "../../../apis/transactions";
import {
  apiError, 
  getDepositsSuccess, 
  getWithdrawalsSuccess, 
  getConvertsSuccess,

  fetchDepositGateWaySuccess,
  fetchDepositGateWayFail,

  fetchWithdrawalGateWaySuccess,
  fetchWithdrawalGateWayFail
} from "./actions";
import { 
  GET_DEPOSITS_START, 
  GET_WITHDRAWALS_START,
  GET_CONVERT_START,

  FETCH_DEPOSIT_GATEWAY_REQUESTED,

  FETCH_WITHDRAWAL_GATEWAY_REQUESTED
} from "./actionTypes";

function * fetchWithdrawals({ payload }){
  try {
    const data = yield call(historyApi.getWithdrawals, payload);
    const { result, status } = data;
    if (status){
      yield put(getWithdrawalsSuccess(result));
    }
  } catch (error){
    yield put(apiError(error));
  }
}

function * fetchDeposits ({ payload }){
  try {
    const data = yield call(historyApi.getDeposits, payload);
    const { result, status } = data;
    if (status){
      yield put(getDepositsSuccess(result));
    }
      
  } catch (error){
    yield put(apiError(error));
  }
}

function * fetchConverts({ payload }){
  try {
    const data = yield call(historyApi.getConverts, payload);
    const { result, status } = data;
    if (status){
      yield put(getConvertsSuccess(result));
    }
  } catch (error){
    yield put(apiError(error));
  }
}

function * getDepositGateWays(){
  try {
    const data = yield call(historyApi.getDepositGateWays);
    yield put(fetchDepositGateWaySuccess(data));
  } catch (error){
    yield put(fetchDepositGateWayFail({ error: error.message }));
  }
}

function * getWithdrawalGateWays(){
  try {
    const data = yield call(historyApi.getWithdrawalGateWays);
    yield put(fetchWithdrawalGateWaySuccess(data));
  } catch (error){
    yield put(fetchWithdrawalGateWayFail({ error: error.message }));
  }
}

function * historySaga(){
  yield takeEvery(GET_DEPOSITS_START, fetchDeposits);
  yield takeEvery(GET_WITHDRAWALS_START, fetchWithdrawals);
  yield takeEvery(GET_CONVERT_START, fetchConverts);
  yield takeEvery(FETCH_DEPOSIT_GATEWAY_REQUESTED, getDepositGateWays);
  yield takeEvery(FETCH_WITHDRAWAL_GATEWAY_REQUESTED, getWithdrawalGateWays);
}

export default historySaga;