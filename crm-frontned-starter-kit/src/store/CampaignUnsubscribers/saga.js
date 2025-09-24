import {
  call, put, takeEvery
} from "redux-saga/effects";
import {
  FETCH_CAMPAIGN_UNSUBSCRIBERS_REQUESTED,
} from "./actionTypes";
import {
  fetchCampaignUnsubscribersSuccess,
  fetchCampaignUnsubscribersFail,
} from "./actions";
import * as API from "../../apis/campaigns/unsubscribers";

function* fetchCampaignUnsubscribers(params) {
  try {
    const data = yield call(API.getCampaignUnsubscribers, params);
    yield put(fetchCampaignUnsubscribersSuccess(data));
  } catch (error) {
    yield put(fetchCampaignUnsubscribersFail(error));
  }
}

function* campaignUnsubscribersesaga() {
  yield takeEvery(FETCH_CAMPAIGN_UNSUBSCRIBERS_REQUESTED, fetchCampaignUnsubscribers);
}

export default campaignUnsubscribersesaga;