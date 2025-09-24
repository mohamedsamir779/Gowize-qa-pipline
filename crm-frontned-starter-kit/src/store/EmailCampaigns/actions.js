import {
  FETCH_EMAIL_CAMPAIGNS_REQUESTED,
  FETCH_EMAIL_CAMPAIGNS_SUCCESS,
  FETCH_EMAIL_CAMPAIGNS_FAIL,

  ADD_EMAIL_CAMPAIGN_REQUESTED,
  ADD_EMAIL_CAMPAIGN_SUCCESS,
  ADD_EMAIL_CAMPAIGN_FAIL,
  ADD_EMAIL_CAMPAIGN_CLEAR,

  DELETE_EMAIL_CAMPAIGN_REQUESTED,
  DELETE_EMAIL_CAMPAIGN_SUCCESS,
  DELETE_EMAIL_CAMPAIGN_FAIL,

  EDIT_EMAIL_CAMPAIGN_REQUESTED,
  EDIT_EMAIL_CAMPAIGN_SUCCESS,
  EDIT_EMAIL_CAMPAIGN_FAIL,
  EDIT_EMAIL_CAMPAIGN_CLEAR,

  GET_CLIENT_GROUPS_REQUESTED,
  GET_CLIENT_GROUPS_SUCCESS,
} from "./actionTypes";

export const fetchEmailCampaigns = (params = {}) => {
  return {
    type: FETCH_EMAIL_CAMPAIGNS_REQUESTED,
    payload: params
  };
};
export const fetchEmailCampaignsSuccess = (data) => {
  return {
    type: FETCH_EMAIL_CAMPAIGNS_SUCCESS,
    payload: data
  };
};
export const fetchEmailCampaignsFail = (error) => {
  return {
    type: FETCH_EMAIL_CAMPAIGNS_FAIL,
    payload: { error }
  };
};

export const addEmailCampaign = (params = {}) => {
  return {
    type: ADD_EMAIL_CAMPAIGN_REQUESTED,
    payload: params
  };
};
export const addEmailCampaignSuccess = (data) => {
  return {
    type: ADD_EMAIL_CAMPAIGN_SUCCESS,
    payload: data
  };
};
export const addEmailCampaignFail = (error) => {
  return {
    type: ADD_EMAIL_CAMPAIGN_FAIL,
    payload: { error }
  };
};
export const addEmailCampaignClear = (data) => {
  return {
    type: ADD_EMAIL_CAMPAIGN_CLEAR,
    payload: data
  };
};

export const deleteEmailCampaign = (params = {}) => {
  return {
    type: DELETE_EMAIL_CAMPAIGN_REQUESTED,
    payload: params
  };
};
export const deleteEmailCampaignSuccess = (data) => {
  return {
    type: DELETE_EMAIL_CAMPAIGN_SUCCESS,
    payload: data
  };
};
export const deleteEmailCampaignFail = (error) => {
  return {
    type: DELETE_EMAIL_CAMPAIGN_FAIL,
    payload: { error }
  };
};

export const editEmailCampaign = (params = {}) => {
  return {
    type: EDIT_EMAIL_CAMPAIGN_REQUESTED,
    payload: params
  };
};
export const editEmailCampaignSuccess = (data) => {
  return {
    type: EDIT_EMAIL_CAMPAIGN_SUCCESS,
    payload: data
  };
};
export const editEmailCampaignFail = (error) => {
  return {
    type: EDIT_EMAIL_CAMPAIGN_FAIL,
    payload: { error }
  };
};
export const editEmailCampaignClear = (data) => {
  return {
    type: EDIT_EMAIL_CAMPAIGN_CLEAR,
    payload: data
  };
};

export const getClientGroups = (params = {}) => {
  return {
    type: GET_CLIENT_GROUPS_REQUESTED,
    payload: params
  };
};
export const getClientGroupsSuccess = (data) => {
  return {
    type: GET_CLIENT_GROUPS_SUCCESS,
    payload: data
  };
};
