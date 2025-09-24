import {
  call, put, takeEvery, delay
} from "redux-saga/effects";
import {
  fetchMarketsSuccess, 
  addNewMarketSuccess, 
  addMarketModalClear, 
  editMarketSuccess, 
  marketEditModalClear,

  changeMarketStatusDone
} from "./actions";
import { 
  getMarkets, 
  addNewMarketAPI, 
  updateMarket, 
  changeMarketStatusApi
} from "apis/markets";
import { addNewMarketError } from "../markets/actions";
import {
  ADD_NEW_MARKET, 
  EDIT_MARKET_START, 
  FETCH_MARKETS_START,

  CHANGE_MARKET_STATUS_REQUESTED
} from "./actionTypes";
import { showErrorNotification, showSuccessNotification } from "store/notifications/actions";

function * fetchMarket(params){
  try {
    const data = yield call(getMarkets, params);
    yield put(fetchMarketsSuccess(data));
  } catch (error){
    // yield put(apiError(error));
  }
}
function * addNewMarket({ payload :{ newMarket } }) {
  try {
    const data = yield call(addNewMarketAPI, newMarket);
    const { status } = data;
    const { result:{ _id } } = data;
    
    if (status){
      yield put(addNewMarketSuccess({
        id:_id, 
        ...newMarket
      }));
      yield delay(2000);
      yield put(addMarketModalClear());
    }
    
  } catch (error){
    yield put(addNewMarketError("Please Enter valid data"));
    yield delay(2000);
    yield put(addNewMarketError(""));
  }
}
function * editMarket(params){
  const { payload } = params;
  const { id, values } = payload;
  
  try {
    yield call(updateMarket, params);
    yield put(editMarketSuccess({
      id,
      values
    }));
    yield delay(2000);
    yield put(marketEditModalClear());
  } catch (error){
    // yield put(apiError("Please Enter Valid data"));
  } 
}

// change market status
function * changeMarketStatus(params) {
  try {
    const data = yield call(changeMarketStatusApi, params);
    const { result } = data;
    yield put(changeMarketStatusDone({
      result,
      id: params.payload.id,
      index: params.payload.index,
    }));
    yield put(showSuccessNotification("Market status updated successfully"));
  }
  catch (error){
    yield put(changeMarketStatusDone({
      error: error.message,
      index: params.payload.index,
    }));
    yield put(showErrorNotification(error.message));
  }   
}

function * marketSaga(){
  yield takeEvery(FETCH_MARKETS_START, fetchMarket);
  yield takeEvery(ADD_NEW_MARKET, addNewMarket);
  yield takeEvery(EDIT_MARKET_START, editMarket);
  yield takeEvery(CHANGE_MARKET_STATUS_REQUESTED, changeMarketStatus);
}
export default marketSaga;