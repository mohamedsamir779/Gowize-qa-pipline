import {
  call, put, takeEvery
} from "redux-saga/effects";
import {
  FETCH_EMAIL_CAMPAIGNS_REQUESTED,
  ADD_EMAIL_CAMPAIGN_REQUESTED,
  DELETE_EMAIL_CAMPAIGN_REQUESTED,
  EDIT_EMAIL_CAMPAIGN_REQUESTED,
  GET_CLIENT_GROUPS_REQUESTED,
} from "./actionTypes";
import {
  fetchEmailCampaignsSuccess,
  fetchEmailCampaignsFail,

  addEmailCampaignSuccess,
  addEmailCampaignFail,
  addEmailCampaignClear,

  deleteEmailCampaignSuccess,
  deleteEmailCampaignFail,

  editEmailCampaignSuccess,
  editEmailCampaignFail,
  editEmailCampaignClear,

  getClientGroupsSuccess
} from "./actions";
import * as API from "../../apis/campaigns";
import { getClientGroups as getGroups } from "apis/client";
import { showSuccessNotification, showErrorNotification } from "store/notifications/actions";

function* fetchEmailCampaigns(params) {
  try {
    const data = yield call(API.getEmailCampaigns, params);
    yield put(fetchEmailCampaignsSuccess(data));
  } catch (error) {
    yield put(fetchEmailCampaignsFail(error));
  }
}

function* addEmailCampaign(params) {
  try {
    const data = yield call(API.addEmailCampaign, params);
    const { result } = data;
    yield put(addEmailCampaignSuccess(result));
    yield put(showSuccessNotification("Campaign Template Added Successfully"));
    yield put(addEmailCampaignClear());
  } catch (error) {
    yield put(addEmailCampaignFail(error));
  }
}

function* editEmailCampaign(params) {
  try {
    const data = yield call(API.editEmailCampaign, params);
    yield put(editEmailCampaignSuccess({
      data,
      id: params.id
    }));
    yield put(editEmailCampaignClear());
    yield put(showSuccessNotification("Campaign Template Updated Successfully"));
  } catch (error) {
    yield put(editEmailCampaignFail({ message: error.message }));
  }
}

function* deleteEmailCampaign(params) {
  try {
    const data = yield call(API.deleteEmailCampaign, params);
    const { result } = data;
    yield put(deleteEmailCampaignSuccess({
      result,
      id: params.payload
    }));
    yield put(showSuccessNotification("Campaign Template Deleted Successfully"));
  } catch (error) {
    yield put(deleteEmailCampaignFail({ error: error.message }));
  }
}

function* getClientGroups(params) {
  try {
    const data = yield call(getGroups, params);
    yield put(getClientGroupsSuccess(data));
  } catch (error) {
    yield put(showErrorNotification(error));
  }
}

function* emailCampaignsaga() {
  yield takeEvery(FETCH_EMAIL_CAMPAIGNS_REQUESTED, fetchEmailCampaigns);
  yield takeEvery(ADD_EMAIL_CAMPAIGN_REQUESTED, addEmailCampaign);
  yield takeEvery(EDIT_EMAIL_CAMPAIGN_REQUESTED, editEmailCampaign);
  yield takeEvery(DELETE_EMAIL_CAMPAIGN_REQUESTED, deleteEmailCampaign);
  yield takeEvery(GET_CLIENT_GROUPS_REQUESTED, getClientGroups);
}

export default emailCampaignsaga;