import {
  FETCH_FOREX_DEPOSITS_REQUESTED,
  FETCH_FOREX_DEPOSITS_SUCCESS,
  FETCH_FOREX_DEPOSITS_FAIL,

  ADD_FOREX_DEPOSIT_REQUESTED,
  ADD_FOREX_DEPOSIT_SUCCESS,
  ADD_FOREX_DEPOSIT_FAIL,
  ADD_FOREX_DEPOSIT_CLEAR,
  ADD_FOREX_DEPOSIT_ERROR_CLEAR,
  APPROVE_FOREX_DEPOSIT,
  REJECT_FOREX_DEPOSIT
} from "./actionTypes";


// fetch forex deposits
export const fetchForexDeposits = (params = {}) => {
  return {
    type: FETCH_FOREX_DEPOSITS_REQUESTED,
    payload: params
  };
};
export const fetchForexDepositsSuccess = (data) => {
  return {
    type: FETCH_FOREX_DEPOSITS_SUCCESS,
    payload: data
  };
};
export const fetchForexDepositsFail = (error) => {
  return {
    type: FETCH_FOREX_DEPOSITS_FAIL,
    payload: { error }
  };
};

export const addForexDeposit = (params = {}) => {
  return {
    type: ADD_FOREX_DEPOSIT_REQUESTED,
    payload: params
  };
};
export const addForexDepositSuccess = (data) => {
  return {
    type: ADD_FOREX_DEPOSIT_SUCCESS,
    payload: data
  };
};
export const addForexDepositFail = (error) => {
  return {
    type: ADD_FOREX_DEPOSIT_FAIL,
    payload: { error }
  };
};
export const addForexDepositClear = (data) => {
  return {
    type: ADD_FOREX_DEPOSIT_CLEAR,
    payload: data
  };
};
export const addForexDepositErrorClear = () => {
  return {
    type: ADD_FOREX_DEPOSIT_ERROR_CLEAR
  };
};
export const approveFxDeposit = (payload)=>{
  return {
    type: APPROVE_FOREX_DEPOSIT,
    payload
  };
};
export const rejectFxDeposit = (payload) =>{
  return {
    type: REJECT_FOREX_DEPOSIT,
    payload
  };
};