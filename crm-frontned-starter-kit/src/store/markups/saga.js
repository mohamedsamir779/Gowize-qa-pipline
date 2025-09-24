import {
  DELETE_MARKUP_START, FETCH_MARKUPS_START, MARKUP_EDIT_START, ADD_MARKUP_START, FETCH_MARKUP_DETAILS_START
} from "./actionTypes";
import {
  call, put, takeEvery, delay
} from "redux-saga/effects";
import {
  getMarkups, fetchSingleMarkupAPI
} from "apis/markups";
import {
  fetchMarkupsSuccess,
  editMarkupSuccess,
  markupEditModalClear,
  deleteMarkupDone,
  addNewMarkupSuccess,
  apiError,
  addMarkupModalClear,
  deletModalClear
} from "./actions";
import {
  updateMarkup, deleteMarkupAPI, addMarkupAPI
} from "apis/markup";
import { showErrorNotification, showSuccessNotification } from "store/notifications/actions";

function* fetchMarkups(params) {
  try {
    const data = yield call(getMarkups, params);
    yield put(fetchMarkupsSuccess(data));
  } catch (error) {
    yield put(apiError(error));
    yield delay(2000);
    yield put(apiError(""));
  }
}
function* editMarket(params) {
  const { payload } = params; 
  const { id, values } = payload;
  try {
    yield call(updateMarkup, params);
    yield put(editMarkupSuccess({
      id,
      values
    }));
    yield delay(2000);
    yield put(markupEditModalClear());
  } catch (error) {
    yield put(apiError(error));
    yield delay(2000);
    yield put(apiError(""));
  }

}
function* deleteMarkup(params) {
  try {
    const data = yield call(deleteMarkupAPI, params.payload);

    const { result } = data;
    if (result) {
      yield put(deleteMarkupDone({
        result,
        id: params.payload,
      }));
      yield put(showSuccessNotification("Markup deleted successfully"));
    }
  } catch (error) {
    yield put(showErrorNotification(error.message));
    yield delay(1000);
    yield put(deletModalClear());
  }
}
function* addMarkup({ payload: newMarkup }) {
  try {
    const data = yield call(addMarkupAPI, newMarkup);
    if (data.status) {
      yield put(addNewMarkupSuccess(data.result));
      yield delay(2000);  
      yield put(addMarkupModalClear());
    }
  } catch (error) {
    yield put(apiError(error));
    yield delay(2000);
    yield put(apiError(""));
  }
}
function* fetchSingleMarkup({ payload }) {
  try {
    yield call(fetchSingleMarkupAPI, payload);
    // console.log(data);
  } catch (error) {
    yield (showErrorNotification(error.message));
  }
}
function* markupSaga() {
  yield takeEvery(FETCH_MARKUPS_START, fetchMarkups);
  yield takeEvery(MARKUP_EDIT_START, editMarket);
  yield takeEvery(DELETE_MARKUP_START, deleteMarkup);
  yield takeEvery(ADD_MARKUP_START, addMarkup);
  yield takeEvery(FETCH_MARKUP_DETAILS_START, fetchSingleMarkup);
}
export default markupSaga;