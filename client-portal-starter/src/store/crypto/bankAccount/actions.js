import {
  DELETE_BANK_ACCOUNTS_START,
  FETCH_BANK_ACCOUNTS_FAILED,
  FETCH_BANK_ACCOUNTS_START,
  FETCH_BANK_ACCOUNTS_SUCCESS,
  UPDATE_BANK_ACCOUNTS_START,
} from "./actionTypes"; 
export const fetchBankAccounts = (params = {}) => {
  return {
    type: FETCH_BANK_ACCOUNTS_START,
    payload: params,
  };
};
export const fetchBankAccountsFailed = (error) => {
  return {
    type: FETCH_BANK_ACCOUNTS_FAILED,
    payload: error,
  };
};
export const fetchBankAccountsSuccess = (params) => {
  return {
    type: FETCH_BANK_ACCOUNTS_SUCCESS,
    payload: params,
  };
};

export const editBankAccountStart = (id, body)=>{
  return {
    type:UPDATE_BANK_ACCOUNTS_START,
    payload:{
      id,
      body
    }
  };
}; 
export const deleteBankAccountStart = (id)=>{
  return {
    type:DELETE_BANK_ACCOUNTS_START,
    payload:{ id }
  };
};