import {
  call, put, takeEvery
} from "redux-saga/effects";
// Login Redux States
import {
  MARKETS_FETCH,
} from "./actionTypes";
import {
  fetchMarketsFailed,
  fetchMarketsSuccessful,
} from "./actions";

//Include Both Helper File with needed methods
import * as marketsApi from "../../../apis/markets";

function* fetchMarkets(params) {
  try {
    const data = yield call(marketsApi.fetchMarkets, params);

    yield put(fetchMarketsSuccessful(data));
  }
  catch (error) {
    yield put(fetchMarketsFailed(error));
  }
}

function* marketsSaga() {
  yield takeEvery(MARKETS_FETCH, fetchMarkets);
}

export default marketsSaga;
