import {
  call, delay, put, takeEvery
} from "redux-saga/effects";

import {
  UPLOAD_DOC_START,
  GET_DOC_START
} from "./actionTypes";
import {
  fetchDocsStart,
  fetchDocsSuccess,
  fetchDocsFail,
  uploadDocsSuccess,
  uploadDocsFail,
  uploadDocsClear
} from "./actions";
import { showErrorNotification, showSuccessNotification } from "../notifications/actions";
import * as documentsApi from "../../../apis/documents";
  
  
function * fetchDocs(params){
  try {
    const data = yield call(documentsApi.getDocuments, params);
    yield put(fetchDocsSuccess(data));
  }
  catch (error){
    yield put(fetchDocsFail(error));
  }  
}
  
function * uploadDocs({ payload }){
  try {
    const data = yield call(documentsApi.uploadDocuments, payload);   
    yield put(uploadDocsSuccess(data));
    yield put(fetchDocsStart());
    yield put(showSuccessNotification("Document uploaded successfully"));
    yield delay(3000);
    yield put(uploadDocsClear());
  }
  catch (error){
    yield put(uploadDocsFail(error.message));
    yield put(showErrorNotification(error.message));
    yield delay(3000);
  } 
}

function* authSaga() {
  yield takeEvery(GET_DOC_START, fetchDocs);
  yield takeEvery(UPLOAD_DOC_START, uploadDocs);
}

export default authSaga;
