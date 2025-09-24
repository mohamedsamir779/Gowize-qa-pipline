import {
  call, put, takeEvery
} from "redux-saga/effects";

import {
  FETCH_DICTIONARY_START,
} from "./actionTypes";
import {
  fetchDictEnd,
} from "./actions";
  
import * as dictApi from "../../../apis/dictionary";
  
  
function * fetchDict(){
  try {
    const data = yield call(dictApi.getDictionary);
    yield put(fetchDictEnd(data.result));
  }
  catch (error){
    yield put(fetchDictEnd({
      error: error.message,
    }));
  }  
}

function* authSaga() {
  yield takeEvery(FETCH_DICTIONARY_START, fetchDict);

}

export default authSaga;
