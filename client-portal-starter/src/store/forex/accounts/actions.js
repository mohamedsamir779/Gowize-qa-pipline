import {
  GET_ACCOUNTS_START,
  GET_ACCOUNTS_SUCCESS,
  CREATE_ACCOUNT_START,
  CREATE_ACCOUNT_SUCCESS,
  CREATE_ACCOUNT_FAIL,
  GET_ACCOUNT_TYPES_START,
  GET_ACCOUNT_TYPES_SUCCESS,
  UPDATE_LEVERAGE_START,
  UPDATE_LEVERAGE_SUCCESS,
  UPDATE_LEVERAGE_FAIL,
  UPDATE_PASSWORD_START,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_FAIL,
  GET_OPEN_POSITIONS_START,
  GET_OPEN_POSITIONS_SUCCESS,
  CLEAR_ACCOUNTS_STATE,
  GET_CLOSE_POSITIONS_START,
  GET_CLOSE_POSITIONS_SUCCESS,
  GET_TRANSFERS_START,
  GET_TRANSFERS_SUCCESS,
  CREATE_INTERNAL_TRANSFER_START,
  CREATE_INTERNAL_TRANSFER_SUCCESS,
  CREATE_INTERNAL_TRANSFER_FAIL,
  CREATE_ACCOUNT_REQUEST_START,
  CREATE_ACCOUNT_REQUEST_SUCCESS,
  CREATE_ACCOUNT_REQUEST_FAIL,
} from "./actionTypes";

export const clearAccountsState = () => {
  return {
    type: CLEAR_ACCOUNTS_STATE,
  };
};
export const createAccount = (payload) => {
  return {
    type: CREATE_ACCOUNT_START,
    payload,
  };
};
export const createAccountSuccess = (params = {}) => {
  return {
    type: CREATE_ACCOUNT_SUCCESS,
    payload: params
  };
};
export const createAccountFail = (params = {}) => {
  return {
    type: CREATE_ACCOUNT_FAIL,
    payload: params
  };
};

export const createAccountRequest = (payload) =>{
  return {
    type: CREATE_ACCOUNT_REQUEST_START,
    payload,
  };
};

export const createAccountRequestSuccess = (params = {}) => {
  return {
    type: CREATE_ACCOUNT_REQUEST_SUCCESS,
    payload: params
  };
};

export const createAccountRequestFail = (params = {}) => {
  return {
    type: CREATE_ACCOUNT_REQUEST_FAIL,
    payload: params
  };
};

export const getAccountsStart = (params) => {
  return {
    type: GET_ACCOUNTS_START,
    payload: params
  };
};
export const getAccountsSuccess = (data) => {
  return {
    type: GET_ACCOUNTS_SUCCESS,
    payload: data
  };
};
export const getAccountTypesStart = (params) => {
  return {
    type: GET_ACCOUNT_TYPES_START,
    payload: params
  };
};
export const getAccountTypesSuccess = (data) => {
  return {
    type: GET_ACCOUNT_TYPES_SUCCESS,
    payload: data
  };
};

export const updateLeverage = (payload) => {
  return {
    type: UPDATE_LEVERAGE_START,
    payload,
  };
};
export const updateLeverageSuccess = (params = {}) => {
  return {
    type: UPDATE_LEVERAGE_SUCCESS,
    payload: params
  };
};
export const updateLeverageFail = (params = {}) => {
  return {
    type: UPDATE_LEVERAGE_FAIL,
    payload: params
  };
};

export const updatePassword = (payload) => {
  return {
    type: UPDATE_PASSWORD_START,
    payload,
  };
};
export const updatePasswordSuccess = (params = {}) => {
  return {
    type: UPDATE_PASSWORD_SUCCESS,
    payload: params
  };
};
export const updatePasswordFail = (params = {}) => {
  return {
    type: UPDATE_PASSWORD_FAIL,
    payload: params
  };
};

export const getOpenPositionsStart = (params) => {
  return {
    type: GET_OPEN_POSITIONS_START,
    payload: params
  };
};
export const getOpenPositionsSuccess = (data) => {
  return {
    type: GET_OPEN_POSITIONS_SUCCESS,
    payload: data
  };
};

export const getClosePositionsStart = (params) => {
  return {
    type: GET_CLOSE_POSITIONS_START,
    payload: params
  };
};
export const getClosePositionsSuccess = (data) => {
  return {
    type: GET_CLOSE_POSITIONS_SUCCESS,
    payload: data
  };
};

export const getTransfersStart = (params) => {
  return {
    type: GET_TRANSFERS_START,
    payload: params
  };
};
export const getTransfersSuccess = (data) => {
  return {
    type: GET_TRANSFERS_SUCCESS,
    payload: data
  };
};

export const createInternalTransferStart = (payload) =>{
  return {
    type: CREATE_INTERNAL_TRANSFER_START,
    payload
  };
};

export const createInternalTransferSuccess = (payload) =>{
  return {
    type: CREATE_INTERNAL_TRANSFER_SUCCESS,
    payload
  };
};

export const createInternalTransferFail = (params = {}) =>{
  return {
    type: CREATE_INTERNAL_TRANSFER_FAIL,
    payload: params
  };
};