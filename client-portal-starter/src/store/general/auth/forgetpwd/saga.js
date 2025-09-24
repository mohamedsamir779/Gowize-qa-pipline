import {
  takeEvery, fork, put, all, call 
} from "redux-saga/effects";

// Login Redux States
import { FORGET_PASSWORD } from "./actionTypes";
import { userForgetPasswordSuccess, userForgetPasswordError } from "./actions";

import { forgotPassword } from "../../../../apis/auth";

//If user is send successfully send mail link then dispatch redux action's are directly from here.
function* forgetUser({ payload }) {
  try {
    const response = yield call(forgotPassword, payload);
    if (response) {
      yield put(
        userForgetPasswordSuccess(
          "Reset link are sent to your mailbox, check there first"
        )
      );
    }
  } catch (error) {
    yield put(userForgetPasswordError(error.message));
  }
}

export function* watchUserPasswordForget() {
  yield takeEvery(FORGET_PASSWORD, forgetUser);
}

function* forgetPasswordSaga() {
  yield all([fork(watchUserPasswordForget)]);
}

export default forgetPasswordSaga;
