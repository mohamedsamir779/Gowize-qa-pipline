import {
  call,
  put,
  takeEvery,
  delay
} from "redux-saga/effects";
import { 
  FETCH_INTERNAL_TRANSFERS_REQUESTED,
  ADD_INTERNAL_TRANSFER_REQUESTED,
  APPROVE_INTERNAL_TRANSFER_SUCCESS,
  APPROVE_INTERNAL_TRANSFER,
  REJECT_INTERNAL_TRANSFER_SUCCESS,
  REJECT_INTERNAL_TRANSFER
} from "./actionTypes";
import {
  fetchInternalTransfersSuccess,
  fetchInternalTransfersFail,

  addInternalTransferSuccess,
  addInternalTransferFail,
  addInternalTransferClear,
  addInternalTransferErrorClear
} from "./actions";
import * as internalTransferApis from "apis/internalTransfer";
import { showErrorNotification, showSuccessNotification } from "store/notifications/actions";

function * fetchInternalTransfers(params){
  try {
    const data = yield call(internalTransferApis.getInternalTransfers, params);
    yield put(fetchInternalTransfersSuccess(data));
  } catch (err){
    yield put(fetchInternalTransfersFail(err.message));
  }
}

function * addInternalTransfer(params){
  try {
    const { payload } = params;
    const data = yield call(internalTransferApis.addApprovedInternalTransferAPI, payload);
    // if (payload.accountType === "ibAccount"){
    //   data = yield call(internalTransferApis.postIbInternalTransfer, values);
    // } else data = yield call(internalTransferApis.postInternalTransfer, values);
    yield put(addInternalTransferSuccess(data));
    yield put(showSuccessNotification("Internal transfer Added Successfully"));
    yield put(addInternalTransferClear());
  } catch (err){
    yield put(showErrorNotification(err.message));
    yield put(addInternalTransferFail(err.message));
    yield delay(5000);
    yield put(addInternalTransferErrorClear());
  }
}

function * approveInternalTransfer({ payload:{ id } }) {
  try {
    const res = yield call(internalTransferApis.approveInternalTransferAPI, id);
    if (res.status){
      yield put({
        type: APPROVE_INTERNAL_TRANSFER_SUCCESS,
        payload: id 
      });
    }
    yield put(showSuccessNotification("Internal Transfer approved successfully"));
  } catch (error) {
    yield put(showErrorNotification(error.message));
  }
}

function* rejectInternalTransfer({ payload: { id } }) {
  try {
    const res = yield call(internalTransferApis.rejectInternalTransferAPI, id, false);
    const { status } = res;
    if (status){
      yield put({
        type: REJECT_INTERNAL_TRANSFER_SUCCESS,
        payload: id,
      });
    }
    yield put(showSuccessNotification("Internal Transfer was rejected"));
  } catch (error) {
    yield put(showErrorNotification(error.message));
  }
}

function * internalTransferSaga(){
  yield takeEvery(FETCH_INTERNAL_TRANSFERS_REQUESTED, fetchInternalTransfers);
  yield takeEvery(ADD_INTERNAL_TRANSFER_REQUESTED, addInternalTransfer);
  yield takeEvery(APPROVE_INTERNAL_TRANSFER, approveInternalTransfer);
  yield takeEvery(REJECT_INTERNAL_TRANSFER, rejectInternalTransfer);
}
export default internalTransferSaga;