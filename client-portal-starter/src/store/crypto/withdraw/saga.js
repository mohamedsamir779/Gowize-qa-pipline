import { 
  call, 
  put, 
  takeLatest
} from "redux-saga/effects";
import { addWithdraw } from "../../../apis/withdraw";
import {
  postWithdrawSuccess,
  postWithdrawFail, 
} from "./actions";

import { POST_Withdraw_START } from "./actionTypes";

function* makeWithdraw({ payload }) {
  try {
    const result = yield call(addWithdraw, payload);
    if (result.status) {
      yield put(postWithdrawSuccess(result.message));
    }
  } catch (error) {
    yield put(postWithdrawFail(error.message));
  }
}
// function * fetchWithdraws ({payload}){
//     try{
//      const data = yield call(getWithdraws, payload)
//      const {result, status} = data
//      if(status){
//        yield put(getWithdrawsSuccess(result))
//      }
//     } catch(error){

//     }
//  }

function* withdrawsSaga() {
  yield takeLatest(POST_Withdraw_START, makeWithdraw);
  // yield takeEvery(GET_WithdrawS_START, fetchWithdraws)
}

export default withdrawsSaga;
