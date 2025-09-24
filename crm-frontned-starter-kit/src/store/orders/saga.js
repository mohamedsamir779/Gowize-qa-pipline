import {
  call, delay, put, takeEvery
} from "redux-saga/effects";
// import login redux states (started or requested)
import {
  FETCH_ORDERS_REQUESTED, 
  ADD_ORDER_REQUESTED,
  DELETE_ORDER_REQUESTED, 
} from "./actionTypes";
// import all actions except the login oncs (started or requested)
import {
  
  fetchOrdersSuccess,
  fetchOrdersFail, 

  addOrderSuccess,
  addOrderFail,
  addOrderClear,

  deleteOrderSuccess,
  deleteOrderFail,
   
} from "./actions";
import * as OrderApi from "../../apis/orders";

function * fetchOrders(params){
  try {
    const data = yield call(OrderApi.getOrders, params);
    yield put(fetchOrdersSuccess(data));
  } catch (error){
    yield put(fetchOrdersFail(error));
  }
}
 
function * addOrder(params){
  try {
    const data = yield call(OrderApi.addUserOrder, params);
    const { result } = data;
    yield put(addOrderSuccess(result));
    yield delay(2000);
    yield put(addOrderClear());
  } catch (error){
    yield put(addOrderFail(error));
    yield delay(2000);
    yield put(addOrderClear());
  }
} 

function * deleteOrder(params){
  try {
    const data = yield call(OrderApi.deleteUserOrder, params);
    const { result } = data;
    yield put(deleteOrderSuccess({
      result,
      id: params.payload 
    }));
  } catch (error){
    yield put(deleteOrderFail({ error: error.message }));
  }
}

function * ordersSaga(){
  yield takeEvery(FETCH_ORDERS_REQUESTED, fetchOrders); 
  yield takeEvery(ADD_ORDER_REQUESTED, addOrder); 
  yield takeEvery(DELETE_ORDER_REQUESTED, deleteOrder);
}

export default ordersSaga;