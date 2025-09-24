import {
  takeEvery, fork, put, all, call
} from "redux-saga/effects";

// Login Redux States
import { CHECK_USER } from "./actionTypes";
import { checkUserExistSuccess, checkUserExistError } from "./actions";

import {  checkUserEmailApi } from "../../../../apis/register";

//If user is send successfully send mail link then dispatch redux action's are directly from here.
function* checkUser(payload) {
  try {
    const response = yield call(checkUserEmailApi, payload);
    if (response) {
      yield put(
        checkUserExistSuccess(
          "Email is not exist"
        )
      );
    }
  } catch (error) {
    yield put(checkUserExistError(error.message));
  }
}

export function* watchCheckUser() {
  yield takeEvery(CHECK_USER, checkUser);
}

function* checkUserSaga() {
  yield all([fork(watchCheckUser)]);
}

export default checkUserSaga;
