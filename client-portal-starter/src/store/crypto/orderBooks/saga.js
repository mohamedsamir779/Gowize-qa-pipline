import {
  call, put, takeEvery
} from "redux-saga/effects";
// Login Redux States
import {
  ORDER_BOOKS_FETCH,
} from "./actionTypes";
import {
  fetchOrderBooksSuccessful,
  fetchOrderBooksFailed,
} from "./actions";

//Include Both Helper File with needed methods
import * as orderBooksApi from "../../../apis/orderBooks";

function* fetchOrderBooks(params) {
  try {
    const data = yield call(orderBooksApi.fetchOrderBooks, params);
    yield put(fetchOrderBooksSuccessful(data));
  }
  catch (error) {
    yield put(fetchOrderBooksFailed(error));
  }
}

function* orderBooksSaga() {
  yield takeEvery(ORDER_BOOKS_FETCH, fetchOrderBooks);
}

export default orderBooksSaga;
