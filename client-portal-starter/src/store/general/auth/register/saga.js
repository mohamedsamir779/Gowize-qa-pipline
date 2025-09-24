import {
  takeEvery, fork, put, all, call
} from "redux-saga/effects";
import {
  REGISTER_DEMO_USER,
  REGISTER_LIVE_USER,

  REGISTER_FOREX_LIVE_USER_REQUESTED,
  REGISTER_FOREX_DEMO_USER_REQUESTED,
  REGISTER_FOREX_IB_USER_REQUESTED
} from "./actionTypes";
import {
  registerLiveUserSuccessful,
  registerDemoUserSuccessful,
  registerLiveUserFailed,
  registerDemoUserFailed,

  registerForexLiveUserSuccessful,
  registerForexLiveUserFailed,
  registerForexDemoUserSuccessful,
  registerForexDemoUserFailed,
  registerForexIbUserSuccessful,
  registerForexIbUserFailed,
} from "./actions";
import { changePortal } from "../../actions";
import {
  registerLiveAPI,
  registerDemoAPI,
  registerForexLiveAPI,
  registerForexDemoAPI,
  registerForexIbAPI
} from "../../../../apis/register";
import { setUser } from "../../../../apis/api_helper";

function* registerLive({ payload }) {
  try {
    const { history } = payload.user;
    const result = yield call(registerLiveAPI, payload);
    if (result.message === "Data created  succesfull") {
      setUser(result.result);
      yield put(changePortal(result.result.defaultPortal));
      yield put(registerLiveUserSuccessful("User created successfully"));
      history.push("/dashboard");
    }
    if (result.isSuccess === false) {
      yield put(registerLiveUserFailed(result.message));
    }
  } catch (error) {
    yield put(registerLiveUserFailed(error));
  }
}

function* registerDemo({ payload }) {
  try {
    const { history } = payload.user;
    const result = yield call(registerDemoAPI, payload);
    if (result.message === "Data created  succesfull") {
      setUser(result.result);
      yield put(changePortal(result.result.defaultPortal));
      yield put(registerDemoUserSuccessful("User created successfully"));
      history.push("/dashboard");
    }
    if (result.isSuccess === false) {
      yield put(registerDemoUserFailed(result.message));
    }
  } catch (error) {
    yield put(registerDemoUserFailed(error));
  }
}

// forex live 
function* registerForexLiveUser({ payload }) {
  try {
    const { history } = payload.user;
    const result = yield call(registerForexLiveAPI, payload);
    if (result.status) {
      setUser(result.result);
      yield put(changePortal(result.result.defaultPortal));
      yield put(registerForexLiveUserSuccessful("User created successfully"));
      history.push("/dashboard");
    }
    if (!result.status) {
      yield put(registerForexLiveUserFailed(result.message));
    }
  } catch (error) {
    yield put(registerForexLiveUserFailed(error));
  }
}

// forex demo 
function* registerForexDemoUser({ payload }) {
  try {
    const { history } = payload.user;
    const result = yield call(registerForexDemoAPI, payload);
    if (result.status) {
      setUser(result.result);
      yield put(changePortal(result.result.defaultPortal));
      yield put(registerForexDemoUserSuccessful("User created successfully"));
      history.push("/dashboard");
    }
    if (!result.status) {
      yield put(registerForexDemoUserFailed(result.message));
    }
  } catch (error) {
    yield put(registerForexDemoUserFailed(error));
  }
}

// forex ib
function* registerForexIbUser({ payload }) {
  try {
    const { history } = payload.user;
    const result = yield call(registerForexIbAPI, payload);
    if (result.status) {
      setUser(result.result);
      yield put(changePortal(result.result.defaultPortal));
      yield put(registerForexIbUserSuccessful("User created successfully"));
      history.push("/dashboard");
    }
    if (!result.status) {
      yield put(registerForexIbUserFailed(result.message));
    }
  } catch (error) {
    yield put(registerForexIbUserFailed(error));
  }
}

export function* watchUserRegister() {
  yield takeEvery(REGISTER_LIVE_USER, registerLive);
  yield takeEvery(REGISTER_DEMO_USER, registerDemo);
  yield takeEvery(REGISTER_FOREX_LIVE_USER_REQUESTED, registerForexLiveUser);
  yield takeEvery(REGISTER_FOREX_DEMO_USER_REQUESTED, registerForexDemoUser);
  yield takeEvery(REGISTER_FOREX_IB_USER_REQUESTED, registerForexIbUser);
}

function* accountSaga() {
  yield all([fork(watchUserRegister)]);
}

export default accountSaga;
