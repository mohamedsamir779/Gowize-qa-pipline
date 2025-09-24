import {
  call, put, takeEvery
} from "redux-saga/effects";

// Login Redux States
import {
  LOGIN_USER, LOGOUT_USER
} from "./actionTypes";
import {
  apiError, loginSuccess
} from "./actions";
import { changePortal, switchSubPortal } from "../../actions";
import { loginUserAPI } from "../../../../apis/auth";
import {
  HIDE_JOU_KYC, HIDE_JOU_IND_PROFILE, HIDE_JOU_FUND, HIDE_JOU_TRADING
} from "common/data/jourenykeys";
import { toggleCurrentModal } from "store/actions";

function* loginUser({ payload: { user, history } }) {
  try {
    const data = yield call(loginUserAPI, user);
    const { result, status } = data;
    if (status) {
      if (!result.token) {
        yield put(toggleCurrentModal("TwoFactorAuth", {
          email: user.email,
          type: "login",
        }));
        yield put(loginSuccess(result));
      }
      if (result.token) {
        localStorage.setItem("authUser", JSON.stringify(result));
        localStorage.setItem("PORTAL", result.defaultPortal);
        yield put(changePortal(result.defaultPortal));
        yield put(switchSubPortal(result.defaultSubPortal));
        yield put(loginSuccess(result));
        history.push("/dashboard");
      }
    } else {
      yield put(apiError(data?.message || "Incorrect email or password"));
    }
  }
  catch (error) {
    yield put(apiError(error));
  }
}


function* logoutUser({ payload: { history } }) {
  try {
    localStorage.removeItem("authUser");
    localStorage.removeItem(HIDE_JOU_KYC);
    localStorage.removeItem(HIDE_JOU_IND_PROFILE);
    localStorage.removeItem(HIDE_JOU_FUND);
    localStorage.removeItem(HIDE_JOU_TRADING);

    history.push("/login");
  } catch (error) {
    yield put(apiError(error));
  }
}


function* authSaga() {
  yield takeEvery(LOGIN_USER, loginUser);
  yield takeEvery(LOGOUT_USER, logoutUser);
}

export default authSaga;
