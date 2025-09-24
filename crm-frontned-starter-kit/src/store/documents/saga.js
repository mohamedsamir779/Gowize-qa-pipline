import {
  call, put, takeEvery
} from "redux-saga/effects";
// Login Redux States
import {
  UPLOAD_DOC_START,
  GET_DOC_START,
  CHANGESTATUS_DOC_START,
  DELETE_DOC_START,
} from "./actionTypes";
import {
  fetchDocsStart,
  fetchDocsSuccess,
  fetchDocsFail,
  uploadDocsSuccess,
  uploadDocsFail,
  uploadDocsClear,
  changeStatusDocFail,
  changeStatusDocSuccess,
  changeStatusClear,
  deleteDocSuccess,
  deleteDocFail,
  deleteClear,
} from "./actions";
import { fetchClientStagesStart } from "../client/actions";
import { showErrorNotification, showSuccessNotification } from "store/notifications/actions";

//Include Both Helper File with needed methods
import * as documentsApi from "../../apis/documents";


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
    const documents = [];
    for (const pair of payload.formData.entries()) {
      if (pair[1] !== "undefined")
        documents.push(pair[0]);
    }
    const data = yield call(documentsApi.uploadDocuments, payload);   
    yield put(uploadDocsSuccess(data));
    yield put(uploadDocsClear());
    yield put(showSuccessNotification(`${[documents]} uploaded successfully`));
    yield put(fetchDocsStart(payload.clientId));
    yield put(fetchClientStagesStart(payload.clientId));
  }
  catch (error){
    yield put(uploadDocsFail(error.message));
    yield put(showErrorNotification(error.message));

  } 
}

function * changeStatusDoc({ payload }){
  try {
    const { index, ...params } = payload;
    const data = yield call(documentsApi.changeStatusDocuments, params);
    yield put(changeStatusDocSuccess({
      ...data,
      index,
      status: params.status,
      rejectionReason: params.rejectionReason
    }));
    yield put(changeStatusClear());
    yield put(showSuccessNotification(`Documents ${payload.status} successfull`));  
    yield put(fetchClientStagesStart(params.customerId));  
  }
  catch (error){
    yield put(changeStatusDocFail(error.message));
    yield put(showErrorNotification(error.message));

  } 
}

function * deleteDoc({ payload }){
  try {
    const { index, ...params } = payload;
    const data = yield call(documentsApi.deleteDocument, params);
    yield put(deleteDocSuccess({
      ...data,
      index,
      status: params.status,
    }));
    yield put(deleteClear());
    yield put(showSuccessNotification("Documents Deleted successfull"));
  }
  catch (error){
    yield put(deleteDocFail(error.message));
    yield put(deleteClear());
    yield put(showErrorNotification(error.message));

  } 
}


function* authSaga() {
  yield takeEvery(GET_DOC_START, fetchDocs);
  yield takeEvery(UPLOAD_DOC_START, uploadDocs);
  yield takeEvery(CHANGESTATUS_DOC_START, changeStatusDoc);
  yield takeEvery(DELETE_DOC_START, deleteDoc);

}

export default authSaga;
