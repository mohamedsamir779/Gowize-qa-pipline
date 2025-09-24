import { 
  call, 
  put, 
  takeLatest
} from "redux-saga/effects";
import { addDeposit } from "../../../apis/deposit";
import {
  postDepositSuccess,
  postDepositFail, 
} from "./actions";

import { POST_Deposit_START } from "./actionTypes";

function* makeDeposit({ payload }) {
  try {
    const result = yield call(addDeposit, payload);
    if (result.status) {
      yield put(postDepositSuccess(result.message));
    }
  } catch (error) {
    yield put(postDepositFail(error.message));
  }
}
// function * fetchDeposits ({payload}){
//     try{
//      const data = yield call(getDeposits, payload)
//      const {result, status} = data
//      if(status){
//        yield put(getDepositsSuccess(result))
//      }
//     } catch(error){

//     }
//  }

function* depositsSaga() {
  yield takeLatest(POST_Deposit_START, makeDeposit);
  // yield takeEvery(GET_DepositS_START, fetchDeposits)
}

export default depositsSaga;
