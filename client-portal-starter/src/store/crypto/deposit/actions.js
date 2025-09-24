import {
  POST_Deposit_START,
  POST_Deposit_SUCCESS,
  POST_Deposit_FAIL,
  GET_DepositS_START,
  GET_DepositS_SUCCESS,
} from "./actionTypes";

export const makeDeposit = (payload) => {
  return {
    type: POST_Deposit_START,
    payload,
  };
};

export const postDepositSuccess = (params = {}) => {
  return {
    type: POST_Deposit_SUCCESS,
    payload: params,
  };
};
export const postDepositFail = (params = {}) => {
  return {
    type: POST_Deposit_FAIL,
    payload: params,
  };
};
export const getDepositsStart = (params) => {
  return {
    type: GET_DepositS_START,
    payload: params,
  };
};
export const getDepositsSuccess = (data) => {
  return {
    type: GET_DepositS_SUCCESS,
    payload: data,
  };
};
