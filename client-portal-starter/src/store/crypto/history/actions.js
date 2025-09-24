import {
  GET_WITHDRAWALS_START,
  GET_WITHDRAWALS_SUCCESS,
  GET_DEPOSITS_START,
  GET_DEPOSITS_SUCCESS,
  GET_CONVERT_START,
  GET_CONVERT_SUCCESS,
  API_ERROR,

  FETCH_DEPOSIT_GATEWAY_REQUESTED,
  FETCH_DEPOSIT_GATEWAY_SUCCESS,
  FETCH_DEPOSIT_GATEWAY_FAIL,

  FETCH_WITHDRAWAL_GATEWAY_REQUESTED,
  FETCH_WITHDRAWAL_GATEWAY_SUCCESS,
  FETCH_WITHDRAWAL_GATEWAY_FAIL
} from "./actionTypes";

export const  getWithdrawalsStart = (params)=>{
  return {
    type:GET_WITHDRAWALS_START,
    payload:params
  };
};
export const getWithdrawalsSuccess = (data)=>{
  return {
    type:GET_WITHDRAWALS_SUCCESS,
    payload:data
  };
};

export const getDepositsStart = (params)=>{
  return {
    type:GET_DEPOSITS_START,
    payload:params
  };
};
export const getDepositsSuccess = (data)=>{
  return {
    type:GET_DEPOSITS_SUCCESS,
    payload:data
  };
};

export const getConvertsStart = (params) => {
  return {
    type: GET_CONVERT_START,
    payload: params
  };
};
export const getConvertsSuccess = (data) => {
  return {
    type: GET_CONVERT_SUCCESS,
    payload: data
  };
};

export const apiError = (error)=>{
  return {
    type:API_ERROR,
    payload:error
  };
};

// deposit gateways
export const fetchDepositGateWay = (payload) => {
  return {
    type: FETCH_DEPOSIT_GATEWAY_REQUESTED,
    payload: payload
  };
};
export const fetchDepositGateWaySuccess = (data) => {
  return {
    type: FETCH_DEPOSIT_GATEWAY_SUCCESS,
    payload: data
  };
};
export const fetchDepositGateWayFail = (error) => {
  return {
    type: FETCH_DEPOSIT_GATEWAY_FAIL,
    payload: error
  };
};

// withdrawal gateways
export const fetchWithdrawalGateWay = (payload) => {
  return {
    type: FETCH_WITHDRAWAL_GATEWAY_REQUESTED,
    payload: payload
  };
};
export const fetchWithdrawalGateWaySuccess = (data) => {
  return {
    type: FETCH_WITHDRAWAL_GATEWAY_SUCCESS,
    payload: data
  };
};
export const fetchWithdrawalGateWayFail = (error) => {
  return {
    type: FETCH_WITHDRAWAL_GATEWAY_FAIL,
    payload: error
  };
};