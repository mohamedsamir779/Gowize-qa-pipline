import {
  getIbClientsAPI, 
  getIbClientAccountsAPI, 
  getIbClientAccountActivitiesAPI,
  getClientIbAccountAPI,
  getAllClientsIbAccountAPI
} from "apis/forex/ib";
import {
  put, call, takeEvery, 
} from "redux-saga/effects";
import {
  GET_IB_CLIENTS_START,
  GET_IB_CLIENTS_SUCCESS,
  GET_IB_CLIENT_ACCOUNTS_START,
  GET_IB_CLIENT_ACCOUNTS_SUCCESS, 
  GET_IB_CLIENT_ACCOUNT_ACTIVITIES_START,
  GET_IB_CLIENT_ACCOUNT_ACTIVITIES_SUCCESS,

  GET_CLIENT_IB_ACCOUNTS_START,
  GET_ALL_CLIENTS_IB_ACCOUNTS_START,
} from "./actionTypes";
import {
  getClientIbAccountsSuccess,
  getClientIbAccountsFailure,
  getAllClientsIbAccountsSuccess,
  getAllClientsIbAccountsFailure
} from "./actions";

function* getClients({ payload }) {
  const { result } = yield call(getIbClientsAPI, payload);
  yield put({
    type: GET_IB_CLIENTS_SUCCESS,
    payload: result 
  });
}

function* getClientAccounts({ payload }) {
  const { result } = yield call(getIbClientAccountsAPI, payload);
  yield put({
    type: GET_IB_CLIENT_ACCOUNTS_SUCCESS,
    payload: result 
  });
}

function* getClientAccountActivities({ payload }) {
  if (!payload.type) return ;
  const { result } = yield call(getIbClientAccountActivitiesAPI, payload);
  if (result)
    yield put({
      type: GET_IB_CLIENT_ACCOUNT_ACTIVITIES_SUCCESS,
      payload: result 
    });
}

// get ib client accounts (owned by the client ibMT4 + ibMT5)
function * getClientIbAccounts() {
  try {
    const data  = yield call(getClientIbAccountAPI);
    if (data.status) {
      yield put(getClientIbAccountsSuccess(data));
    }
  } catch (error) {
    yield put(getClientIbAccountsFailure(error));
  }
}

// get all clients accounts
function * getAllClientsIbAccounts(payload) {
  try {
    const data  = yield call(getAllClientsIbAccountAPI, payload);
    if (data.status) {
      yield put(getAllClientsIbAccountsSuccess(data));
    }
  } catch (error) {
    yield put(getAllClientsIbAccountsFailure(error));
  }
}

function* clientsSaga() {
  yield takeEvery(GET_IB_CLIENTS_START, getClients);
  yield takeEvery(GET_IB_CLIENT_ACCOUNTS_START, getClientAccounts);
  yield takeEvery(GET_IB_CLIENT_ACCOUNT_ACTIVITIES_START, getClientAccountActivities);
  yield takeEvery(GET_CLIENT_IB_ACCOUNTS_START, getClientIbAccounts);
  yield takeEvery(GET_ALL_CLIENTS_IB_ACCOUNTS_START, getAllClientsIbAccounts);
}
  
export default clientsSaga;
