import { getAssets } from "../../../apis/assets";
import { FETCH_ASSETS_START } from "./actionTypes";
import {
  takeEvery, call, fork, all, put 
} from "redux-saga/effects";
import { getAssetsSuccess } from "./actions";

function* fetchAssets() {
  try {
    const result = yield call(getAssets);
    yield put(getAssetsSuccess(result));
  } catch (error) {
  }
}

function* watchAssets() {
  yield takeEvery(FETCH_ASSETS_START, fetchAssets);
}

function* assetsSaga() {
  yield all([fork(watchAssets)]);
}

export default assetsSaga;