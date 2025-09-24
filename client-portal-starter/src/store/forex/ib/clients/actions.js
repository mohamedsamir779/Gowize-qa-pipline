import {
  GET_IB_CLIENTS_START,
  GET_IB_CLIENT_ACCOUNTS_START,
  GET_IB_CLIENT_ACCOUNT_ACTIVITIES_START,
  REQ_IB_START,

  GET_CLIENT_IB_ACCOUNTS_START,
  GET_CLIENT_IB_ACCOUNTS_SUCCESS,
  GET_CLIENT_IB_ACCOUNTS_FAILURE,

  GET_ALL_CLIENTS_IB_ACCOUNTS_START,
  GET_ALL_CLIENTS_IB_ACCOUNTS_SUCCESS,
  GET_ALL_CLIENTS_IB_ACCOUNTS_FAILURE,  
} from "./actionTypes";

export const getIbClients = (params) =>{
  return {
    type: GET_IB_CLIENTS_START,
    payload: params
  };
};

export const getClientAccounts = (params) =>{
  return {
    type:GET_IB_CLIENT_ACCOUNTS_START,
    payload:params
  };

};

export const getClientAccountActivities = (params)=>{
  return {
    type:GET_IB_CLIENT_ACCOUNT_ACTIVITIES_START,
    payload:params
  };
};

export const RequestPartnership = (params)=>{
  return {
    type: REQ_IB_START,
    payload: params
  };
};

// get ib client accounts (owned by the client ibMT4 + ibMT5)
export const getClientIbAccounts = () => {
  return {
    type: GET_CLIENT_IB_ACCOUNTS_START
  };
};
export const getClientIbAccountsSuccess = (data) => {
  return {
    type: GET_CLIENT_IB_ACCOUNTS_SUCCESS,
    payload: data
  };
};
export const getClientIbAccountsFailure = (error) => {
  return {
    type: GET_CLIENT_IB_ACCOUNTS_FAILURE,
    payload: error
  };
};

// get all clients accounts
export const getAllClientsIbAccounts = (params) => {
  return {
    type: GET_ALL_CLIENTS_IB_ACCOUNTS_START,
    payload: params
  };
};
export const getAllClientsIbAccountsSuccess = (data) => {
  return {
    type: GET_ALL_CLIENTS_IB_ACCOUNTS_SUCCESS,
    payload: data
  };
};
export const getAllClientsIbAccountsFailure = (error) => {
  return {
    type: GET_ALL_CLIENTS_IB_ACCOUNTS_FAILURE,
    payload: error
  };
};