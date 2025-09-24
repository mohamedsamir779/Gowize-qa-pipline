import {
  FETCH_WITHDRAWALS_START,
  FETCH_WITHDRAWALS_SUCCESS,
  MAKE_WITHDRAWAL_START,
  MAKE_WITHDRAWAL_SUCCESS,
  WITHDRAWAL_ERROR,
  MODAL_CLEAR,
  WITHDRAW_APPROVE,
  WITHDRAW_REJECT,
  WITHDRAW_STATUS_CHANGE_SUCCESS,
  WITHDRAW_STATUS_CHANGE_FAIL,
  WITHDRAWAL_ERROR_CLEAR,

  FETCH_CLIENT_WITHDRAWALS_REQUESTED,
  FETCH_CLIENT_WITHDRAWALS_SUCCESS,
  FETCH_CLIENT_WITHDRAWALS_FAIL,
  ERROR_CLEAR
} from "./actionTypes";
export const fetchWithdrawalsStart = (params)=>{
  return {
    type:FETCH_WITHDRAWALS_START,
    payload:params
  };
};
export const fetchWithdrawalsSuccess = (data)=>{
  return {
    type:FETCH_WITHDRAWALS_SUCCESS,
    payload:data
  };
};
export const makeWithdrawalStart = (withdrawal)=>{
  return {
    type:MAKE_WITHDRAWAL_START,
    payload:{ withdrawal }
  };

};
export const makeWithdrawalSuccess = (withdrawal)=>{
  return {
    type:MAKE_WITHDRAWAL_SUCCESS,
    payload: { withdrawal }
  };
};
export const withdrawalError = (error)=>{
  return {
    type:WITHDRAWAL_ERROR,
    payload:{ error }
  };
};
export const modalClear = (data)=>{
  return {
    type:MODAL_CLEAR,
    payload:data
  };
};
export const withdrawApproveStart = (payload)=>{
  return {
    type:WITHDRAW_APPROVE,
    payload:payload 
  };
};
export const withdrawRejectStart = (payload)=>{
  return {
    type:WITHDRAW_REJECT,
    payload: payload 
  };
};
export const withdrawStatusChangeSuccess = (data)=>{
  return {
    type:WITHDRAW_STATUS_CHANGE_SUCCESS,
    payload:data
  };
};
export const withdrawStateChangeFail = (error) => {
  return {
    type: WITHDRAW_STATUS_CHANGE_FAIL,
    payload: { error }
  };
};

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
export const errorClear = ()=>{
  return {
    type:ERROR_CLEAR
  };
};

export const withdrawalErrorClear = () => {
  return {
    type: WITHDRAWAL_ERROR_CLEAR
  };
};