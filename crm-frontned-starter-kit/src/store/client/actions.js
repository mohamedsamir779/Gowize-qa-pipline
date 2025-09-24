import {
  FETCH_CLIENTS_START,
  FETCH_CLIENTS_SUCCESS,
  FETCH_CLIENTS_FAILED,

  FETCH_REFERRALS_START,
  FETCH_REFERRALS_SUCCESS,

  FETCH_IB_PARENTS_START,
  FETCH_IB_PARENTS_SUCCESS,

  FETCH_STATEMENT_START,
  FETCH_STATEMENT_SUCCESS,
  FETCH_STATEMENT_DEALS_START,
  FETCH_STATEMENT_DEALS_SUCCESS,

  LINK_CLIENT_START,
  LINK_CLIENT_SUCCESS,
  UNLINK_IB_START,
  UNLINK_IB_SUCCESS,
  UNLINK_CLIENTS_START,
  UNLINK_CLIENTS_SUCCESS,

  ADD_NEW_CLIENT,
  ADD_NEW_CLIENT_SUCCESS,
  API_ERROR,

  FETCH_CLIENT_DETAILS_REQUESTED,
  FETCH_CLIENT_DETAILS_SUCCESS,
  FETCH_CLIENT_DETAILS_FAIL,
  FETCH_CLIENT_DETAILS_CLEAR,
  FETCH_CLIENT_STAGES_START,
  FETCH_CLIENT_STAGES_END,
  EDIT_CLIENT_DETAILS_REQUESTED,
  EDIT_CLIENT_DETAILS_SUCCESS,
  EDIT_CLIENT_DETAILS_FAIL,
  EDIT_CLIENT_DETAILS_CLEAR,
  ADD_MODAL_CLEAR,
  ASSIGN_AGENT_START,
  ASSIGN_AGENT_SUCCESS,
  UPDATE_EMPLOYMENT_INFO_START,
  UPDATE_EMPLOYMENT_INFO_SUCCESS,
  UPDATE_FINANCIAL_INFO_START,
  UPDATE_FINANCIAL_INFO_SUCCESS,
  UPDATE_EMPLOYMENT_INFO_FAIL,
  UPDATE_FINANCIAL_INFO_FAIL,
  CHANGE_PASSWORD_START,
  RESET_PASSWORD_CLEAR,
  CLIENT_FORGOT_PASSWORD_START,
  CLIENT_FORGOT_PASSWORD_CLEAR,
  CLIENT_DISABLE_2FA_START,
  CONVERT_TO_IB_START,
  CONVERT_TO_IB_CLEAR,
  CONVERT_TO_CLIENT_START,
  CONVERT_TO_CLIENT_SUCCESS,
  CONVERT_TO_CLIENT_FAIL,
  CONVERT_TO_CLIENT_CLEAR,
  GET_MT5_MARKUP_START,
  UPDATE_CLIENT_CALL_STATUS,
  UPDATE_CLIENT_CALL_STATUS_SUCCESS,
  UPDATE_CLIENT_CALL_STATUS_FAILED,
  ADD_NEW_IB_SUCCESS,
  ADD_NEW_IB
} from "./actionsType";

export const fetchClientsStart = (params = {})=>{
  return {
    type:FETCH_CLIENTS_START,
    payload:params
  };
};
export const fetchClientsSuccess = (data)=>{
  return {
    type:FETCH_CLIENTS_SUCCESS,
    payload:data
  };
};

export const fetchClientsFailed = (data)=>{
  return {
    type: FETCH_CLIENTS_FAILED,
    payload:data
  };
};

export const assignAgentToClientStart = (params = {})=>{
  return {
    type:ASSIGN_AGENT_START,
    payload:params
  };
};
export const assignAgentToClientSuccess = (data)=>{
  return {
    type: ASSIGN_AGENT_SUCCESS,
    payload:data
  }; 
};
export const apiError = (error)=>{
  return {
    type:API_ERROR,
    payload:{ error }
  };
};
   
export const addNewClient = (newClient)=>{
  return {
    type:ADD_NEW_CLIENT,
    payload:newClient
  };
};
export const addNewClientSuccess = (newClient)=>{
  return {
    type:ADD_NEW_CLIENT_SUCCESS,
    payload:newClient
    
  };
};

export const addNewIb = (newIb)=>{
  return {
    type: ADD_NEW_IB,
    payload: newIb
  };
};

export const addNewIbSuccess = (newIb)=>{
  return {
    type: ADD_NEW_IB_SUCCESS,
    payload: newIb
    
  };
};

// fetch client details by id
export const fetchClientDetails = (params = {}) => {
  return {
    type: FETCH_CLIENT_DETAILS_REQUESTED,
    payload: params 
  };
};
export const fetchClientDetailsSuccess = (data) => {
  return {
    type: FETCH_CLIENT_DETAILS_SUCCESS,
    payload: data
  };
};
export const fetchClientDetailsFail = (error) => {
  return {
    type: FETCH_CLIENT_DETAILS_FAIL,
    payload: { error }
  };
};
export const fetchClientDetailsClear = (data) => {
  return {
    type: FETCH_CLIENT_DETAILS_CLEAR,
    payload: data
  };
};
export const  fetchClientStagesStart = (data) => {
  return {
    type: FETCH_CLIENT_STAGES_START,
    payload: data
  };
};
export const fetchClientStagesEnd = (data) => {
  return {
    type: FETCH_CLIENT_STAGES_END,
    payload: data
  };
};

// update client details 
export const editClientDetails = (params = {}) => {
  return {
    type: EDIT_CLIENT_DETAILS_REQUESTED,
    payload: params
  };
};
export const editClientDetailsSuccess = (data) => {
  return {
    type: EDIT_CLIENT_DETAILS_SUCCESS,
    payload: data 
  };
};
export const editClientDetailsFail = (error) => {
  return {
    type: EDIT_CLIENT_DETAILS_FAIL,
    payload: { error }
  };
};
export const editClientDetailsClear = (data) => {
  return {
    type: EDIT_CLIENT_DETAILS_CLEAR,
    payload: data
  };
};
export const addModalClear = ()=>{
  return {
    type:ADD_MODAL_CLEAR
  };
};
export const updateFinancialInfoStart = (params)=>{
  return {
    type:UPDATE_FINANCIAL_INFO_START,
    payload:params
  };
};
export const  updateFinancialInfoSuccess = (data)=>{
  return {
    type:UPDATE_FINANCIAL_INFO_SUCCESS,
    payload:data
  };
};
export const updateEmploymentStatusStart = (params)=>{
  return {
    type:UPDATE_EMPLOYMENT_INFO_START,
    payload:params
  };
};
export const updateEmploymentStatusSuccess = (data)=>{
  return {
    type:UPDATE_EMPLOYMENT_INFO_SUCCESS,
    payload:data
  };
};
export const updateEmploymentInfoFail = ()=>{
  return {
    type:UPDATE_EMPLOYMENT_INFO_FAIL
  };
};
export const updateFinancialInfoFail = ()=>{
  return {
    type: UPDATE_FINANCIAL_INFO_FAIL
  };
};
export const resetPasswordStart = (params)=>{
  return {
    type:CHANGE_PASSWORD_START,
    payload:params
  };
};

export const resetPasswordClear = ()=>{
  return {
    type:RESET_PASSWORD_CLEAR
  };
};

export const clientForgotPasswordStart = (params)=>{
  return {
    type:CLIENT_FORGOT_PASSWORD_START,
    payload:params
  };
};

export const clientForgotPasswordClear = ()=>{
  return {
    type:CLIENT_FORGOT_PASSWORD_CLEAR
  };
};
export const disable2FA = (params)=>{
  return {
    type:CLIENT_DISABLE_2FA_START,
    payload:params
  };
};

//ib
export const fetchReferrals = (params = {})=>{
  return {
    type: FETCH_REFERRALS_START,
    payload :params
  };
};
export const fetchReferralsSuccess = (data)=>{
  return {
    type: FETCH_REFERRALS_SUCCESS,
    payload: data
  };
};

export const fetchIbParents = (params = {})=>{
  return {
    type: FETCH_IB_PARENTS_START,
    payload: params
  };
};
export const fetchIbParentsSuccess = (data)=>{
  return {
    type: FETCH_IB_PARENTS_SUCCESS,
    payload: data
  };
};
export const fetchStatement = (params = {})=>{
  return {
    type: FETCH_STATEMENT_START,
    payload :params
  };
};
export const fetchStatementSuccess = (data)=>{
  return {
    type: FETCH_STATEMENT_SUCCESS,
    payload: data
  };
};
export const fetchStatementDeals = (params = {})=>{
  return {
    type: FETCH_STATEMENT_DEALS_START,
    payload: params
  };
};
export const fetchStatementDealsSuccess = (data)=>{
  return {
    type: FETCH_STATEMENT_DEALS_SUCCESS,
    payload: data
  };
};

export const linkClient = (params = {})=>{
  return {
    type: LINK_CLIENT_START,
    payload: params
  };
};

export const linkClientSuccess = (data)=>{
  return {
    type: LINK_CLIENT_SUCCESS,
    payload: data
  }; 
};

export const unlinkIb = (params = {})=>{
  return {
    type: UNLINK_IB_START,
    payload: params
  };
};
export const unlinkIbSuccess = (data)=>{
  return {
    type: UNLINK_IB_SUCCESS,
    payload: data
  };
};
export const unlinkClients = (params = {})=>{
  return {
    type: UNLINK_CLIENTS_START,
    payload: params
  };
};
export const unlinkClientsSuccess = (data)=>{
  return {
    type: UNLINK_CLIENTS_SUCCESS,
    payload: data
  };
};

//client convert actions 
export const convertToIB = (data) => {
  return {
    type: CONVERT_TO_IB_START,
    payload: data,
  };
};

export const convertToIBClear = ()=>{
  return {
    type: CONVERT_TO_IB_CLEAR
  };
};

// Convert client to Live Account
export const convertToClientStart = (data) => {
  return {
    type: CONVERT_TO_CLIENT_START,
    payload: data,
  };
};

export const convertTClientSuccess = (data) => {
  return {
    type: CONVERT_TO_CLIENT_SUCCESS,
    payload: data,
  };
};

export const convertToClientFail = (data) => {
  return {
    type: CONVERT_TO_CLIENT_FAIL,
    payload: data,
  };
};

export const convertToClientClear = () => {
  return {
    type: CONVERT_TO_CLIENT_CLEAR,
  };
};

export const getMT5Markups = (payload) => {
  return {
    type: GET_MT5_MARKUP_START,
    payload,
  };
};

export const updateClientCallStatus = (clientId, callStatus) => {
  return {
    type: UPDATE_CLIENT_CALL_STATUS,
    payload: {
      clientId,
      callStatus,
    }
  };
};

export const updateClientCallStatusSuccess = (leadId, callStatus) => {
  return {
    type: UPDATE_CLIENT_CALL_STATUS_SUCCESS,
    payload: {
      leadId,
      callStatus,
    }
  };
};

export const updateClientCallStatusFailed = (error) => {
  return {
    type: UPDATE_CLIENT_CALL_STATUS_FAILED,
    payload: {
      error
    }
  };
};
