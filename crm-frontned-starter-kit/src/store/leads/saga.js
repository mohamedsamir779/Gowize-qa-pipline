
import {
  call, put, takeEvery, delay
} from "redux-saga/effects";
import {
  addNewLead,
  addNewLeadExcel,
  fetchLeadsFromAPI,
  updateCallStatusApi,
} from "../../apis/lead-api";
import {
  apiError,
  addNewLeadSuccess,
  fetchLeadsSuccess,
  addModalClear,
  addNewLeadExcelFailed,
  addNewLeadExcelSuccess,
  fetchLeadsFailed,
  updateCallStatusSuccess,
  updateCallStatusFailed,
} from "./actions";
import {
  ADD_NEW_LEAD,
  ADD_NEW_LEAD_EXCEL,
  FETCH_LEADS_START,
  UPDATE_CALL_STATUS,
} from "./actionsType";
import { showErrorNotification, showSuccessNotification } from "store/notifications/actions";
function* fetchLeads(params) {
  try {
    const data = yield call(fetchLeadsFromAPI, params);
    yield put(fetchLeadsSuccess(data));
  } catch (error) {
    yield put(fetchLeadsFailed(error));
    yield put(apiError("Oppos there is a problem in the server"));
  }
}

function* addNewLeadSaga({ payload: { newLead } }) {
  try {
    const data = yield call(addNewLead, newLead);
    const { status } = data;
    if (status) {
      yield put(addNewLeadSuccess(newLead));
      yield put(showSuccessNotification("Lead is added successfully!"));
      yield put(addModalClear());
    }
  }
  catch (error) {
    yield put(apiError("Invalid data"));
    yield delay(2000);
    yield put(apiError(""));
  }

}

function* addNewLeadsExcelSaga({ payload: { leadsExcel } }) {
  try {
    const data = yield call(addNewLeadExcel, leadsExcel);
    const { status, result } = data;
    if (status) {
      yield put(addNewLeadExcelSuccess(result));
      yield put(showSuccessNotification("Leads have been imported successfully!"));
      yield delay(1000);
      yield put(addModalClear());
    }
  }
  catch (error) {
    yield put(apiError("Invalid data"));
    yield put(addNewLeadExcelFailed(error));
    yield put(showErrorNotification("Data could not be processed!"));
    yield delay(2000);
    yield put(apiError(""));
  }
}

function* updateCallStatusSaga({ payload }) {
  try {
    const data = yield call(updateCallStatusApi, payload);
    const { isSuccess } = data;
    if (isSuccess) {
      yield put(updateCallStatusSuccess(payload.leadId, payload.callStatus));
      yield put(showSuccessNotification("Call status has been updated successfully!"));
    } else {
      yield put(updateCallStatusFailed(new Error(data.message || "Call status could not be updated!")));
      yield put(showErrorNotification(data.message || "Call status could not be updated!"));
    }
  }
  catch (error) {
    yield put(updateCallStatusFailed(error));
    yield put(showErrorNotification(error.message || "Call status could not be updated!"));
  }
}

function* leadSaga() {
  yield takeEvery(FETCH_LEADS_START, fetchLeads);
  yield takeEvery(ADD_NEW_LEAD, addNewLeadSaga);
  yield takeEvery(ADD_NEW_LEAD_EXCEL, addNewLeadsExcelSaga);
  yield takeEvery(UPDATE_CALL_STATUS, updateCallStatusSaga);
}

export default leadSaga;