import {
  FETCH_CLIENT_WITHDRAWALS_REQUESTED,
  FETCH_CLIENT_WITHDRAWALS_SUCCESS,
  FETCH_CLIENT_WITHDRAWALS_FAIL,
} from "./actionTypes";

// fetch client withdrawals 
export const fetchClientWithdrawals = (params = {}) => {
  return {
    type: FETCH_CLIENT_WITHDRAWALS_REQUESTED,  
    payload: params
  };
};
export const fetchClientWithdrawalsSuccess = (data) => {
  return {
    type: FETCH_CLIENT_WITHDRAWALS_SUCCESS,
    payload: data
  };
};
export const fetchClientWithdrawalsFail = (error) => {
  return {
    type: FETCH_CLIENT_WITHDRAWALS_FAIL,
    payload: { error }
  };
};