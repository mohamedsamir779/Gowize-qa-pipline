import {
  takeEvery, fork, put, all, call, delay 
} from "redux-saga/effects";

// Login Redux States
import { RESET_PASSWORD } from "./actionTypes";
import { 
  resetPasswordSuccess, 
  resetPasswordFail,
  resetPasswordClear 
} from "./actions";

//Include Both Helper File with needed methods
import * as resetPasswordApis from "../../../apis/resetPassword";


function* resetPassword({ payload }) {
  try {
    const response = yield call(resetPasswordApis.resetPassword, payload);
    if (response) {
      yield put(
        resetPasswordSuccess(
          "Reset link are sent to your mailbox, check there first"
        )
      );
      yield delay(3000);
      yield put(resetPasswordClear());
    }
  } catch (error) {
    yield put(resetPasswordFail(error.message));
    yield delay(3000);
    yield put(resetPasswordClear());
  }
}

export function* watchUserPasswordForget() {
  yield takeEvery(RESET_PASSWORD, resetPassword);
}

function* forgetPasswordSaga() {
  yield all([fork(watchUserPasswordForget)]);
}

export default forgetPasswordSaga;
