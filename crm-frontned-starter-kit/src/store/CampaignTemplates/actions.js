import {
  FETCH_CAMPAIGN_TEMPLATES_REQUESTED,
  FETCH_CAMPAIGN_TEMPLATES_SUCCESS,
  FETCH_CAMPAIGN_TEMPLATES_FAIL,

  ADD_CAMPAIGN_TEMPLATE_REQUESTED,
  ADD_CAMPAIGN_TEMPLATE_SUCCESS,
  ADD_CAMPAIGN_TEMPLATE_FAIL,
  ADD_CAMPAIGN_TEMPLATE_CLEAR,

  DELETE_CAMPAIGN_TEMPLATE_REQUESTED,
  DELETE_CAMPAIGN_TEMPLATE_SUCCESS,
  DELETE_CAMPAIGN_TEMPLATE_FAIL,

  EDIT_CAMPAIGN_TEMPLATE_REQUESTED,
  EDIT_CAMPAIGN_TEMPLATE_SUCCESS,
  EDIT_CAMPAIGN_TEMPLATE_FAIL,
  EDIT_CAMPAIGN_TEMPLATE_CLEAR,

  FETCH_CAMPAIGN_TEMPLATE_HTML_REQUESTED,
  FETCH_CAMPAIGN_TEMPLATE_HTML_SUCCESS,
  FETCH_CAMPAIGN_TEMPLATE_HTML_FAIL,
} from "./actionTypes";

export const fetchCampaignTemplates = (params = {}) => {
  return {
    type: FETCH_CAMPAIGN_TEMPLATES_REQUESTED,
    payload: params
  };
};
export const fetchCampaignTemplatesSuccess = (data) => {
  return {
    type: FETCH_CAMPAIGN_TEMPLATES_SUCCESS,
    payload: data
  };
};
export const fetchCampaignTemplatesFail = (error) => {
  return {
    type: FETCH_CAMPAIGN_TEMPLATES_FAIL,
    payload: { error }
  };
};

export const addCampaignTemplate = (params = {}) => {
  return {
    type: ADD_CAMPAIGN_TEMPLATE_REQUESTED,
    payload: params
  };
};
export const addCampaignTemplateSuccess = (data) => {
  return {
    type: ADD_CAMPAIGN_TEMPLATE_SUCCESS,
    payload: data
  };
};
export const addCampaignTemplateFail = (error) => {
  return {
    type: ADD_CAMPAIGN_TEMPLATE_FAIL,
    payload: { error }
  };
};
export const addCampaignTemplateClear = (data) => {
  return {
    type: ADD_CAMPAIGN_TEMPLATE_CLEAR,
    payload: data
  };
};

export const deleteCampaignTemplate = (params = {}) => {
  return {
    type: DELETE_CAMPAIGN_TEMPLATE_REQUESTED,
    payload: params
  };
};
export const deleteCampaignTemplateSuccess = (data) => {
  return {
    type: DELETE_CAMPAIGN_TEMPLATE_SUCCESS,
    payload: data
  };
};
export const deleteCampaignTemplateFail = (error) => {
  return {
    type: DELETE_CAMPAIGN_TEMPLATE_FAIL,
    payload: { error }
  };
};

export const editCampaignTemplate = (params = {}) => {
  return {
    type: EDIT_CAMPAIGN_TEMPLATE_REQUESTED,
    payload: params
  };
};
export const editCampaignTemplateSuccess = (data) => {
  return {
    type: EDIT_CAMPAIGN_TEMPLATE_SUCCESS,
    payload: data
  };
};
export const editCampaignTemplateFail = (error) => {
  return {
    type: EDIT_CAMPAIGN_TEMPLATE_FAIL,
    payload: { error }
  };
};
export const editCampaignTemplateClear = (data) => {
  return {
    type: EDIT_CAMPAIGN_TEMPLATE_CLEAR,
    payload: data
  };
};

export const fetchCampaignTemplateHTML = (params = {}) => {
  return {
    type: FETCH_CAMPAIGN_TEMPLATE_HTML_REQUESTED,
    payload: params
  };
};
export const fetchCampaignTemplateHTMLSuccess = (data) => {
  return {
    type: FETCH_CAMPAIGN_TEMPLATE_HTML_SUCCESS,
    payload: data
  };
};
export const fetchCampaignTemplateHTMLFail = (error) => {
  return {
    type: FETCH_CAMPAIGN_TEMPLATE_HTML_FAIL,
    payload: { error }
  };
};