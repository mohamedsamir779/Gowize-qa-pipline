import { FETCH_TRANSACTIONS_PROFITS_START, FETCH_TRANSACTIONS_PROFITS_SUCCESS } from "./actionTypes";

export const fetchTransactionsProfitsStart = (params = {}) =>{
  return {
    type:FETCH_TRANSACTIONS_PROFITS_START,
    payload:params
  };
};

export const fetchTransactionsProfitsSuccess = (params = {}) =>{
  return {
    type:FETCH_TRANSACTIONS_PROFITS_SUCCESS,
    payload:params
  };
};