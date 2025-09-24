import {
  FETCH_FOREX_WITHDRAWALS_REQUESTED,
  FETCH_FOREX_WITHDRAWALS_SUCCESS,
  FETCH_FOREX_WITHDRAWALS_FAIL,

  ADD_FOREX_WITHDRAWAL_REQUESTED,
  ADD_FOREX_WITHDRAWAL_SUCCESS,
  ADD_FOREX_WITHDRAWAL_FAIL,
  ADD_FOREX_WITHDRAWAL_CLEAR,
  ADD_FOREX_WITHDRAWAL_ERROR_CLEAR,
  APPROVE_FOREX_WITHDRAWAL,
  REJECT_FOREX_WITHDRAWAL
} from "./actionTypes";


// fetch forex withdrawals
export const fetchForexWithdrawals = (params = {}) => {
  return {
    type: FETCH_FOREX_WITHDRAWALS_REQUESTED,
    payload: params
  };
};
export const fetchForexWithdrawalsSuccess = (data) => {
  return {
    type: FETCH_FOREX_WITHDRAWALS_SUCCESS,
    payload: data
  };
};
export const fetchForexWithdrawalsFail = (error) => {
  return {
    type: FETCH_FOREX_WITHDRAWALS_FAIL,
    payload: { error }
  };
};

// add new forex withdrawal
export const addForexWithdrawal = (params = {}) => {
  return {
    type: ADD_FOREX_WITHDRAWAL_REQUESTED,
    payload: params
  };
};
export const addForexWithdrawalSuccess = (data) => {
  return {
    type: ADD_FOREX_WITHDRAWAL_SUCCESS,
    payload: data
  };
};
export const addForexWithdrawalFail = (error) => {
  return {
    type: ADD_FOREX_WITHDRAWAL_FAIL,
    payload: { error }
  };
};
export const addForexWithdrawalClear = (data) => {
  return {
    type: ADD_FOREX_WITHDRAWAL_CLEAR,
    payload: data
  };
};
export const addForexWithdrawalErrorClear = () => {
  return {
    type: ADD_FOREX_WITHDRAWAL_ERROR_CLEAR
  };
};
export const approveFxWithdrawal = (payload)=>{
  return {
    type: APPROVE_FOREX_WITHDRAWAL,
    payload
  };
};
export const rejectFxWithdrawal = (payload)=>{
  return {
    type: REJECT_FOREX_WITHDRAWAL,
    payload
  };
};