import {
  FETCH_CAMPAIGN_UNSUBSCRIBERS_REQUESTED,
  FETCH_CAMPAIGN_UNSUBSCRIBERS_SUCCESS,
  FETCH_CAMPAIGN_UNSUBSCRIBERS_FAIL,
} from "./actionTypes";

export const fetchCampaignUnsubscribers = (params = {}) => {
  return {
    type: FETCH_CAMPAIGN_UNSUBSCRIBERS_REQUESTED,
    payload: params
  };
};
export const fetchCampaignUnsubscribersSuccess = (data) => {
  return {
    type: FETCH_CAMPAIGN_UNSUBSCRIBERS_SUCCESS,
    payload: data
  };
};
export const fetchCampaignUnsubscribersFail = (error) => {
  return {
    type: FETCH_CAMPAIGN_UNSUBSCRIBERS_FAIL,
    payload: { error }
  };
};
