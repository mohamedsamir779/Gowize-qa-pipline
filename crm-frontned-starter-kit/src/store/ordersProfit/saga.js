import {
  call, delay, put, takeEvery
} from "redux-saga/effects";
// import login redux states (started or requested)
import {
  FETCH_ORDERS_PROFITS_START,
} from "./actionTypes";
// import all actions except the login oncs (started or requested)
import {
  fetchOrdersProfitsSuccess
} from "./actions";
import { getOrderProfitsAPI } from "../../apis/orderProfits";
  
function * fetchOrders(params){
  try {
    const data = yield call(getOrderProfitsAPI, params);
    yield put(fetchOrdersProfitsSuccess(data));
  } catch (error){
    // yield put(fetchOrdersFail(error));
  }
}
  
function * ordersProfitsSaga(){
  yield takeEvery(FETCH_ORDERS_PROFITS_START, fetchOrders); 
}
  
export default ordersProfitsSaga;