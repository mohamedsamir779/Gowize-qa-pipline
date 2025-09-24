import {
  FETCH_MARKET_PRICING_START, FETCH_ORDER_BOOK_START
} from "./actionTypes";
import {
  call, put, takeEvery
} from "redux-saga/effects";
import {
  getMarketPrices, getOrderBook
} from "apis/marketPricing";
import {
  fetchMarketPriceSuccess, fetchOrderBookSuccess
} from "./actions";
import { showErrorNotification } from "store/notifications/actions";

function* fetchMarketPricing(params) {
  try {
    const data = yield call(getMarketPrices, params);
    yield put(fetchMarketPriceSuccess(data));
  } catch (error) {
    yield put(showErrorNotification(error.message));
  }
}

function* fetchOrderBook(params) {
  try {
    const data = yield call(getOrderBook, params);
    yield put(fetchOrderBookSuccess(data));
  } catch (error) {

  }
}

function* marketPricingSaga() {
  yield takeEvery(FETCH_MARKET_PRICING_START, fetchMarketPricing);
  yield takeEvery(FETCH_ORDER_BOOK_START, fetchOrderBook);
}
export default marketPricingSaga;