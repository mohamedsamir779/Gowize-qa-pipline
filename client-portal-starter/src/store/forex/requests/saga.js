import {
  requestPartnershipAPI, 
  getRequestTypeAPI,
  postChangeLeverageReq 
} from "apis/forex/requests";
import {
  put, call, takeEvery, 
} from "redux-saga/effects";
import { showErrorNotification, showSuccessNotification } from "store/general/notifications/actions";
import {
  REQ_IB_START, REQ_IB_SUCCESS, 
  GET_IB_REQUEST_STATUS, 
  REQ_IB_FAIL, 
  GET_IB_REQUEST_STATUS_SUCCESS, 
  GET_IB_REQUEST_STATUS_FAIL, 
  CREATE_CHANGE_LEVERAGE_REQ_REQUESTED
} from "./actionTypes";
import {
  createChangeLeverageSuccess,
  createChangeLeverageFail
} from "./actions";
import { toggleCurrentModal } from "store/actions";


function* ReqIB({ payload }) {
  try { 
    const result = yield call(requestPartnershipAPI, payload);
    if (result.status)
      yield put({
        type: REQ_IB_SUCCESS,
        payload: result 
      });
    else {
      yield put({
        type: REQ_IB_FAIL,
      });
      yield put(showErrorNotification(result?.message));
    }
  } catch (error) {
    yield put({
      type: REQ_IB_FAIL,
    });
    yield put(showErrorNotification(error.message));
  }
}

function* getRequestType({ payload }) {
  const { result } = yield call(getRequestTypeAPI, payload);
  if (result)
    yield put({
      type: GET_IB_REQUEST_STATUS_SUCCESS,
      payload: result 
    });
  yield put({
    type: GET_IB_REQUEST_STATUS_FAIL,
    payload: result 
  });
}

function * createChangeLeverageReq({ payload }){
  try {
    const result = yield call(postChangeLeverageReq, payload);
    yield put(createChangeLeverageSuccess(result));
    yield put(showSuccessNotification("Change leverage request was sent successfully"));
    yield put(toggleCurrentModal(""));
  } catch (error){
    yield put(createChangeLeverageFail(error));
    yield put(showErrorNotification(error.message));
  }
}

function* requests() {
  yield takeEvery(REQ_IB_START, ReqIB);
  yield takeEvery(GET_IB_REQUEST_STATUS, getRequestType);
  yield takeEvery(CREATE_CHANGE_LEVERAGE_REQ_REQUESTED, createChangeLeverageReq);
}
    
export default requests;
