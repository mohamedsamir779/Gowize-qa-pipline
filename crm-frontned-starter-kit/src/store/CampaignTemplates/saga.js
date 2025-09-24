import {
  call, put, takeEvery
} from "redux-saga/effects";
import {
  FETCH_CAMPAIGN_TEMPLATES_REQUESTED,
  ADD_CAMPAIGN_TEMPLATE_REQUESTED,
  DELETE_CAMPAIGN_TEMPLATE_REQUESTED,
  EDIT_CAMPAIGN_TEMPLATE_REQUESTED,
  FETCH_CAMPAIGN_TEMPLATE_HTML_REQUESTED,
} from "./actionTypes";
import {
  fetchCampaignTemplatesSuccess,
  fetchCampaignTemplatesFail,

  addCampaignTemplateSuccess,
  addCampaignTemplateFail,
  addCampaignTemplateClear,

  deleteCampaignTemplateSuccess,
  deleteCampaignTemplateFail,

  editCampaignTemplateSuccess,
  editCampaignTemplateFail,
  editCampaignTemplateClear,

  fetchCampaignTemplateHTMLSuccess,
  fetchCampaignTemplateHTMLFail,
} from "./actions";
import * as API from "../../apis/campaigns/templates";
import { showSuccessNotification } from "store/notifications/actions";

function* fetchCampaignTemplates(params) {
  try {
    const data = yield call(API.getCampaignTemplates, params);
    yield put(fetchCampaignTemplatesSuccess(data));
  } catch (error) {
    yield put(fetchCampaignTemplatesFail(error));
  }
}

function* addCampaignTemplate(params) {
  try {
    const data = yield call(API.addCampaignTemplate, params);
    const { result } = data;
    yield put(addCampaignTemplateSuccess(result));
    yield put(showSuccessNotification("Campaign Template Added Successfully"));
    yield put(addCampaignTemplateClear());
  } catch (error) {
    yield put(addCampaignTemplateFail(error));
  }
}

function* editCampaignTemplate(params) {
  try {
    const data = yield call(API.editCampaignTemplate, params);
    yield put(editCampaignTemplateSuccess({
      data,
      id: params.id
    }));
    yield put(editCampaignTemplateClear());
    yield put(showSuccessNotification("Campaign Template Updated Successfully"));
  } catch (error) {
    yield put(editCampaignTemplateFail({ message: error.message }));
  }
}

function* deleteCampaignTemplate(params) {
  try {
    const data = yield call(API.deleteCampaignTemplate, params);
    const { result } = data;
    yield put(deleteCampaignTemplateSuccess({
      result,
      id: params.payload
    }));
    yield put(showSuccessNotification("Campaign Template Deleted Successfully"));
  } catch (error) {
    yield put(deleteCampaignTemplateFail({ error: error.message }));
  }
}

function* fetchCampaignTemplateHTML(params) {
  try {
    const data = yield call(API.fetchCampaignTemplateHTML, params);
    yield put(fetchCampaignTemplateHTMLSuccess(data));
  } catch (error) {
    yield put(fetchCampaignTemplateHTMLFail({ error: error.message }));
  }
}

function* campaignTemplatesaga() {
  yield takeEvery(FETCH_CAMPAIGN_TEMPLATES_REQUESTED, fetchCampaignTemplates);
  yield takeEvery(ADD_CAMPAIGN_TEMPLATE_REQUESTED, addCampaignTemplate);
  yield takeEvery(EDIT_CAMPAIGN_TEMPLATE_REQUESTED, editCampaignTemplate);
  yield takeEvery(DELETE_CAMPAIGN_TEMPLATE_REQUESTED, deleteCampaignTemplate);
  yield takeEvery(FETCH_CAMPAIGN_TEMPLATE_HTML_REQUESTED, fetchCampaignTemplateHTML);
}

export default campaignTemplatesaga;