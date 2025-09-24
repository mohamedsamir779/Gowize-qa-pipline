import {
  FETCH_CLIENT_TRANSACTIONS_START,
  FETCH_CLIENT_TRANSACTIONS_END
} from "./actionTypes";

export const fetchClientTransactions = (params = {})=>{
  return {
    type:FETCH_CLIENT_TRANSACTIONS_START,
    payload:params
  };
};
export const fetchClientTransactionsEnd = (data)=>{
  return {
    type:FETCH_CLIENT_TRANSACTIONS_END,
    payload:data
  };
};