import {
  verifyCodeAPI, generateQRCodeAPI 
} from "apis/auth";
import {
  call,
  put,
  takeEvery
} from "redux-saga/effects";
import { getUserProfile, toggleCurrentModal } from "store/actions";
import { showErrorNotification, showSuccessNotification } from "store/notifications/actions";
import {
  generateQRCodeSuccess, verify2FACodeFail, verify2FACodeSuccess, generateQRCodeError
} from "./actions";

import {
  GENERATE_QR_CODE_START, VERIFY_TWO_FACTOR_CODE_START 
} from "./actionTypes";
  
function * generateQRCode(params){
  try {
    const data = yield call(generateQRCodeAPI, params.payload);
    const { status, result } = data;
    if (status)
      yield put(generateQRCodeSuccess(result));
  } catch (error){ 
    yield put(generateQRCodeError(error.message));
    yield put(showErrorNotification(error.message));
  }
}

function * verifyCode({ payload }) {
  try {
    const { history, type } = payload;
    delete payload.history;
    const data = yield call(verifyCodeAPI, payload);
    const { result, status } = data;
    if (type === "login") {
      if (status && result.token) {
        localStorage.setItem("authUser", JSON.stringify(result));
        yield put(getUserProfile());
        yield put(verify2FACodeSuccess(data));
        yield put(toggleCurrentModal(""));
        history.push("/dashboard");
      } 
    } else {
      yield put(verify2FACodeSuccess({ 
        ...data, 
        type,
      }));
      yield put(showSuccessNotification("Verified succcessfully"));
    }
  } catch (error) {
    yield put (verify2FACodeFail(error.message));
    yield put(showErrorNotification(error.message));
  }
}

function * twoFactorAuthSaga(){
  yield takeEvery(GENERATE_QR_CODE_START, generateQRCode);
  yield takeEvery(VERIFY_TWO_FACTOR_CODE_START, verifyCode);
}
    
export default twoFactorAuthSaga;