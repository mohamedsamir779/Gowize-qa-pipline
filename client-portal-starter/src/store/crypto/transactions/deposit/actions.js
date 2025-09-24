import {
  FETCH_CLIENT_DEPOSITS_REQUESTED,
  FETCH_CLIENT_DEPOSITS_SUCCESS,
  FETCH_CLIENT_DEPOSITS_FAIL,
} from "./actionTypes";

// fetch client deposits
export const fetchClientDeposits = (params = {}) => {
  return {
    type: FETCH_CLIENT_DEPOSITS_REQUESTED,  
    payload: params
  };
};
export const fetchClientDepositsSuccess = (data) => {
  return {
    type: FETCH_CLIENT_DEPOSITS_SUCCESS,
    payload: data
  };
};
export const fetchClientDepositsFail = (error) => {
  return {
    type: FETCH_CLIENT_DEPOSITS_FAIL,
    payload: { error }
  };
};