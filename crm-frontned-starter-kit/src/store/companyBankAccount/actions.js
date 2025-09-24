import {
  FETCH_COMPANY_BANK_ACCOUNT_REQUESTED,
  FETCH_COMPANY_BANK_ACCOUNT_SUCCESS,
  FETCH_COMPANY_BANK_ACCOUNT_FAIL,

  ADD_COMPANY_BANK_ACCOUNT_REQUESTED,
  ADD_COMPANY_BANK_ACCOUNT_SUCCESS,
  ADD_COMPANY_BANK_ACCOUNT_FAIL,
  ADD_COMPANY_BANK_ACCOUNT_CLEAR,

  DELETE_COMPANY_BANK_ACCOUNT_REQUESTED,
  DELETE_COMPANY_BANK_ACCOUNT_SUCCESS,
  DELETE_COMPANY_BANK_ACCOUNT_FAIL,

  EDIT_COMPANY_BANK_ACCOUNT_REQUESTED,
  EDIT_COMPANY_BANK_ACCOUNT_SUCCESS,
  EDIT_COMPANY_BANK_ACCOUNT_FAIL,
  EDIT_COMPANY_BANK_ACCOUNT_CLEAR
} from "./actionTypes";

export const fetchBankAccount = (params = {}) => {
  return {
    type: FETCH_COMPANY_BANK_ACCOUNT_REQUESTED,
    payload: params
  };
};
export const fetchClientBankAccountSuccess = (data) => {
  return {
    type: FETCH_COMPANY_BANK_ACCOUNT_SUCCESS,
    payload: data
  };
};
export const fetchClientBankAccountFail = (error) => {
  return {
    type: FETCH_COMPANY_BANK_ACCOUNT_FAIL,
    payload: { error }
  };
};

export const addBankAccount = (params = {}) => {
  return {
    type: ADD_COMPANY_BANK_ACCOUNT_REQUESTED,
    payload: params
  };
};
export const addBankAccountSuccess = (data) => {
  return {
    type: ADD_COMPANY_BANK_ACCOUNT_SUCCESS,
    payload: data
  };
};
export const addBankAccountFail = (error) => {
  return {
    type: ADD_COMPANY_BANK_ACCOUNT_FAIL,
    payload: { error }
  };
};
export const addBankAccountClear = (data) => {
  return {
    type: ADD_COMPANY_BANK_ACCOUNT_CLEAR,
    payload: data
  };
};

export const deleteBankAccount = (params) => {
  return {
    type: DELETE_COMPANY_BANK_ACCOUNT_REQUESTED,
    payload: params
  };
};
export const deleteBankAccountSuccess = (data) => {
  return {
    type: DELETE_COMPANY_BANK_ACCOUNT_SUCCESS,
    payload: data
  };
};
export const deleteBankAccountFail = (error) => {
  return {
    type: DELETE_COMPANY_BANK_ACCOUNT_FAIL,
    payload: { error }
  };
};

export const editBankAccount = (params) => {
  return {
    type: EDIT_COMPANY_BANK_ACCOUNT_REQUESTED,
    payload: params
  };
};
export const editBankAccountSuccess = (data) => {
  return {
    type: EDIT_COMPANY_BANK_ACCOUNT_SUCCESS,
    payload: data
  };
};
export const editBankAccountFail = (error) => {
  return {
    type: EDIT_COMPANY_BANK_ACCOUNT_FAIL,
    payload: { error }
  };
};
export const editBankAccountClear = (data) => {
  return {
    type: EDIT_COMPANY_BANK_ACCOUNT_CLEAR,
    payload: data
  };
};