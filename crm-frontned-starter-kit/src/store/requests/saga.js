import {
  call, put, takeEvery 
} from "redux-saga/effects";
import {
  fetchIbStartsSuccess, fetchIbStartsError, ibRequestToApproveStateChange, ibRequestToRejectStateChange,
  fetchLeverageStartsSuccess, fetchLeverageStartsError, leverageRequestToApproveStateChange, leverageRequestToRejectStateChange, fetchAccountRequestsSuccess, fetchAccountRequestsFail, accountRequestToApproveStateChange, accountRequestToRejectStateChange, ibRequestApproveError, ibRequestRejectError, leverageRequestApproveError, leverageRequestRejectError, accountRequestApproveError, accountRequestRejectError
}  from "./actions";
import * as actionTypes from "./actionTypes";
import * as requestApi from "../../apis/requests";
import { showErrorNotification, showSuccessNotification } from "store/notifications/actions";

function * fetchIbs(params) {
  try {
    const data = yield call(requestApi.getIbsRequsts, params);
    yield put(fetchIbStartsSuccess(data.result));
  }
  catch (error) {
    yield put(fetchIbStartsError(error));
  }
}

function* ibRequestApprove( params){
  try {
    const data = yield call(requestApi.approveIbRequest, { requestId: params.payload });
    const { result } = data;
    if (data?.isSuccess) { 
      yield put(ibRequestToApproveStateChange(result));
      yield put(showSuccessNotification("Request approved successfully"));
    } else {
      yield put(showErrorNotification("Unable to process the request"));
      yield put(ibRequestApproveError("Unable to process the request"));
    }
  } catch (error) {
    yield put(showErrorNotification(error.message));
    yield put(ibRequestApproveError("Unable to process the request"));
  }
  
}

function* ibRequestReject( params){
  try {
    // eslint-disable-next-line no-debugger
    debugger;
    const data = yield call(requestApi.rejectIbRequest, { requestId: params.payload });
    const { result } = data;
    if (data?.isSuccess) { 
      yield put(ibRequestToRejectStateChange(result));
      yield put(showSuccessNotification("Request rejected successfully"));
    } else {
      yield put(showErrorNotification("Unable to process the request"));
      yield put(ibRequestRejectError("Unable to process the request"));
    }
  } catch (error) {
    yield put(showErrorNotification(error.message));
    yield put(ibRequestRejectError("Unable to process the request"));
  }
  
}

function * fetchLeverages(params) {
  try {
    const data = yield call(requestApi.getLeveragesRequsts, params);
    yield put(fetchLeverageStartsSuccess(data.result));
  }
  catch (error) {
    yield put(fetchLeverageStartsError(error));
  }
}


function* leverageRequestApprove(params){
  try {
    const data = yield call(requestApi.approveLeverageRequest, { requestId: params.payload });
    const { result } = data;
    yield put(leverageRequestToApproveStateChange(result));
    yield put(showSuccessNotification("Request approved successfully"));
  } catch (error) {
    yield put(leverageRequestApproveError("Unable to process the request"));
    yield put(showErrorNotification("Unable to process the request"));
  }
}

function* leverageRequestReject( params){
  try {
    const data = yield call(requestApi.rejectLeverageRequest, { requestId: params.payload });
    const { result } = data;
    yield put(leverageRequestToRejectStateChange(result));
    yield put(showSuccessNotification("Request rejected successfully"));
  } catch (error) {
    yield put(leverageRequestRejectError("Unable to process the request"));
    yield put(showErrorNotification("Unable to process the request"));
  }
}

function* fetchAccountRequests(params) {
  try {
    const data = yield call(requestApi.fetchAccountRequests, params.payload);
    yield put(fetchAccountRequestsSuccess(data.result));
  }
  catch (error) {
    yield put(fetchAccountRequestsFail(error));
  }
}

function* accountRequestApprove(params){
  try {
    const data = yield call(requestApi.approveAccountRequest, { requestId: params.payload });
    const { result } = data;
    yield put(accountRequestToApproveStateChange(result));
    yield put(showSuccessNotification("Request approved successfully"));
  } catch (error) {
    yield put(accountRequestApproveError(error));
    yield put(showErrorNotification("Unable to process the request"));
  }
}

function* accountRequestReject(params){
  try {
    const data = yield call(requestApi.rejectAccountRequest, { requestId: params.payload });
    const { result } = data;
    yield put(accountRequestToRejectStateChange(result));
    yield put(showSuccessNotification("Request reject successfully"));
  } catch (error) {
    yield put(accountRequestRejectError(error));
    yield put(showErrorNotification("Unable to process the request"));
  }
}

function* requestSaga() {
  yield takeEvery(actionTypes.FETCH_IB_REQUESTS_START, fetchIbs);
  yield takeEvery(actionTypes.IB_REQUEST_APPROVE_START, ibRequestApprove);
  yield takeEvery(actionTypes.IB_REQUEST_REJECT_START, ibRequestReject);
  yield takeEvery(actionTypes.FETCH_LEVERAGE_REQUESTS_START, fetchLeverages);
  yield takeEvery(actionTypes.LEVERAGE_REQUEST_APPROVE_START, leverageRequestApprove);
  yield takeEvery(actionTypes.LEVERAGE_REQUEST_REJECT_START, leverageRequestReject);
  yield takeEvery(actionTypes.FETCH_ACCOUNT_REQUESTS_START, fetchAccountRequests);
  yield takeEvery(actionTypes.ACCOUNT_REQUEST_APPROVE_START, accountRequestApprove);
  yield takeEvery(actionTypes.ACCOUNT_REQUEST_REJECT_START, accountRequestReject);
}

export default requestSaga;