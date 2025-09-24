import {
  FETCH_LEADS_START,
  FETCH_LEADS_SUCCESS,
  API_ERROR,
  ADD_NEW_LEAD,
  ADD_NEW_LEAD_SUCCESS,
  ADD_MODAL_CLEAR,
  ADD_NEW_LEAD_EXCEL,
  ADD_NEW_LEAD_EXCEL_SUCCESS,
  ADD_NEW_LEAD_EXCEL_FAILED,
  FETCH_LEADS_FAILED,
  UPDATE_CALL_STATUS,
  UPDATE_CALL_STATUS_SUCCESS,
  UPDATE_CALL_STATUS_FAILED
} from "./actionsType";

export const fetchLeadsStart = (params = {}) => {
  return {
    type: FETCH_LEADS_START,
    payload: params
  };
};

export const fetchLeadsSuccess = (data) => {
  return {
    type: FETCH_LEADS_SUCCESS,
    payload: data
  };
};

export const fetchLeadsFailed = (data) => {
  return {
    type: FETCH_LEADS_FAILED,
    payload: data
  };
};

export const apiError = (error) => {
  return {
    type: API_ERROR,
    payload: { error }
  };
};

export const addNewLead = (newLead) => {
  return {
    type: ADD_NEW_LEAD,
    payload: { newLead }
  };
};

export const addNewLeadSuccess = (newLead) => {
  return {
    type: ADD_NEW_LEAD_SUCCESS,
    payload: {
      newLead
    }
  };
};

export const addNewLeadExcel = (leadsExcel) => {
  return {
    type: ADD_NEW_LEAD_EXCEL,
    payload: { leadsExcel }
  };
};

export const addNewLeadExcelSuccess = (leads) => {
  return {
    type: ADD_NEW_LEAD_EXCEL_SUCCESS,
    payload: {
      leads
    }
  };
};

export const addNewLeadExcelFailed = (error) => {
  return {
    type: ADD_NEW_LEAD_EXCEL_FAILED,
    payload: {
      error
    }
  };
};

export const addModalClear = () => {
  return {
    type: ADD_MODAL_CLEAR
  };
};

export const updateCallStatus = (leadId, callStatus) => {
  return {
    type: UPDATE_CALL_STATUS,
    payload: {
      leadId,
      callStatus,
    }
  };
};

export const updateCallStatusSuccess = (leadId, callStatus) => {
  return {
    type: UPDATE_CALL_STATUS_SUCCESS,
    payload: {
      leadId,
      callStatus,
    }
  };
};

export const updateCallStatusFailed = (error) => {
  return {
    type: UPDATE_CALL_STATUS_FAILED,
    payload: {
      error
    }
  };
};
