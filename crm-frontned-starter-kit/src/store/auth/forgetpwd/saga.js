import {
  takeEvery, fork, put, all, call, delay 
} from "redux-saga/effects";

// Login Redux States
import { FORGET_PASSWORD } from "./actionTypes";
import { 
  userForgetPasswordSuccess, 
  userForgetPasswordError,
  userForgetPasswordClear 
} from "./actions";
import * as forgotPasswordApis from "../../../apis/forgotPassword";

function* forgetUser({ payload }) {
  try {
    const response = yield call(forgotPasswordApis.forgotPassword, payload);
    if (response) {
      yield put(
        userForgetPasswordSuccess(
          "Reset link are sent to your mailbox, check there first"
        )
      );
      yield delay(3000);
      yield put(userForgetPasswordClear());
    }
  } catch (error) {
    yield put(userForgetPasswordError(error.message));
    yield delay(3000);
    yield put(userForgetPasswordClear());
  }
}

export function* watchUserPasswordForget() {
  yield takeEvery(FORGET_PASSWORD, forgetUser);
}

function* forgetPasswordSaga() {
  yield all([fork(watchUserPasswordForget)]);
}

export default forgetPasswordSaga;
