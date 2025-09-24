import {
  FETCH_CLIENT_BANK_ACCOUNT_REQUESTED,
  FETCH_CLIENT_BANK_ACCOUNT_SUCCESS,
  FETCH_CLIENT_BANK_ACCOUNT_FAIL,

  ADD_BANK_ACCOUNT_REQUESTED,
  ADD_BANK_ACCOUNT_SUCCESS,
  ADD_BANK_ACCOUNT_FAIL,
  ADD_BANK_ACCOUNT_CLEAR,

  DELETE_BANK_ACCOUNT_REQUESTED,
  DELETE_BANK_ACCOUNT_SUCCESS,
  DELETE_BANK_ACCOUNT_FAIL,

  EDIT_BANK_ACCOUNT_REQUESTED,
  EDIT_BANK_ACCOUNT_SUCCESS,
  EDIT_BANK_ACCOUNT_FAIL,
  EDIT_BANK_ACCOUNT_CLEAR
} from "./actionTypes";

// fetch client bank details
export const fetchClientBankAccount = (params = {}) => {
  return {
    type: FETCH_CLIENT_BANK_ACCOUNT_REQUESTED,
    payload: params
  };
};
export const fetchClientBankAccountSuccess = (data) => {
  return {
    type: FETCH_CLIENT_BANK_ACCOUNT_SUCCESS,
    payload: data
  };
};
export const fetchClientBankAccountFail = (error) => {
  return {
    type: FETCH_CLIENT_BANK_ACCOUNT_FAIL,
    payload: { error }
  };
};

// add bank account
export const addBankAccount = (params = {}) => {
  return {
    type: ADD_BANK_ACCOUNT_REQUESTED,
    payload: params
  };
};
export const addBankAccountSuccess = (data) => {
  return {
    type: ADD_BANK_ACCOUNT_SUCCESS,
    payload: data
  };
};
export const addBankAccountFail = (error) => {
  return {
    type: ADD_BANK_ACCOUNT_FAIL,
    payload: { error }
  };
};
export const addBankAccountClear = (data) => {
  return {
    type: ADD_BANK_ACCOUNT_CLEAR,
    payload: data
  };
};

// delete bank account
export const deleteBankAccount = (params) => {
  return {
    type: DELETE_BANK_ACCOUNT_REQUESTED,
    payload: params
  };
};
export const deleteBankAccountSuccess = (data) => {
  return {
    type: DELETE_BANK_ACCOUNT_SUCCESS,
    payload: data
  };
};
export const deleteBankAccountFail = (error) => {
  return {
    type: DELETE_BANK_ACCOUNT_FAIL,
    payload: { error }
  };
};

// edit bank account
export const editBankAccount = (params) => {
  return {
    type: EDIT_BANK_ACCOUNT_REQUESTED,
    payload: params
  };
};
export const editBankAccountSuccess = (data) => {
  return {
    type: EDIT_BANK_ACCOUNT_SUCCESS,
    payload: data
  };
};
export const editBankAccountFail = (error) => {
  return {
    type: EDIT_BANK_ACCOUNT_FAIL,
    payload: { error }
  };
};
export const editBankAccountClear = (data) => {
  return {
    type: EDIT_BANK_ACCOUNT_CLEAR,
    payload: data
  };
};