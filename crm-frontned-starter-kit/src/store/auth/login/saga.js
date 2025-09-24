import {
  call, put, takeEvery 
} from "redux-saga/effects";
// Login Redux States
import {
  LOGIN_USER, LOGOUT_USER 
} from "./actionTypes";
import {
  apiError, logoutUserSuccess 
} from "./actions";

//Include Both Helper File with needed methods
import * as authApi from "../../../apis/auth";
import { getUserProfile, clearProfile } from "../profile/actions";

import { toggleCurrentModal } from "store/actions";

// Logout User
function* logout({ payload: { history } } ) {
  try {
    localStorage.removeItem("authUser");
    yield put(clearProfile());
    yield put(logoutUserSuccess());
    // redirect to login page
    history.push("/login");
  } catch (error) {
    yield put(apiError(error));
  }
}

function * loginWithAPI({ payload: { values, history } }){
  try {
    const data = yield call(authApi.loginUser, values);
    const { isError, result } = data;
    if (isError) {
      yield put(apiError("Invalid Credentials"));
    } else if (!result.token) {
      yield put(toggleCurrentModal("TwoFactorAuth", {
        email: values.email,
        type: "login",
      }));
    } else if (result.token) {
      localStorage.setItem("authUser", JSON.stringify(result));
      yield put(getUserProfile());
      history.push("/dashboard");
    }
  }
  catch (error){
    yield put(apiError(error));
  } 
}
function* authSaga() {
  yield takeEvery(LOGIN_USER, loginWithAPI);
  yield takeEvery(LOGOUT_USER, logout);
}

export default authSaga;
