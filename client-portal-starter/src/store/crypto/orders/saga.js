import {
  call, put, takeEvery, takeLatest
} from "redux-saga/effects";
import { postOrderAPI, getOrders } from "../../../apis/orders";
import {
  postOrderSuccess, postOrderFail, getOrdersSuccess 
} from "./actions";

import { POST_ORDER_START, GET_ORDERS_START } from "./actionTypes";
import { showErrorNotification } from "../../general/notifications/actions";
import { toggleCurrentModal } from "store/actions";


function* makeOrder({ payload }) {
  try {
    const result = yield call(postOrderAPI, payload);
    if (result.status) {
      yield put(postOrderSuccess(result));
      yield put(toggleCurrentModal("sellBuyDetail", payload));
      // yield put(showSuccessNotification(result.message));
      // yield delay(3000);
      // yield put(toggleCurrentModal(""));
    }
  }
  catch (error) {
    yield put(postOrderFail(error.message));
    yield put(showErrorNotification(error.message));
  }
}
function * fetchOrders ({ payload }){
  try {
    const data = yield call(getOrders, payload);
    const { result, status } = data;
    if (status){
      yield put(getOrdersSuccess(result));
    }
  } catch (error){
      
  }
}

function* ordersSaga() {
  yield takeLatest(POST_ORDER_START, makeOrder);
  yield takeEvery(GET_ORDERS_START, fetchOrders);
}

export default ordersSaga;