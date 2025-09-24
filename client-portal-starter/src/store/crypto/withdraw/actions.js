import {
  POST_Withdraw_START,
  POST_Withdraw_SUCCESS,
  POST_Withdraw_FAIL,
  GET_WithdrawS_START,
  GET_WithdrawS_SUCCESS,
} from "./actionTypes";

export const makeWithdraw = (payload) => {
  return {
    type: POST_Withdraw_START,
    payload,
  };
};

export const postWithdrawSuccess = (params = {}) => {
  return {
    type: POST_Withdraw_SUCCESS,
    payload: params,
  };
};
export const postWithdrawFail = (params = {}) => {
  return {
    type: POST_Withdraw_FAIL,
    payload: params,
  };
};
export const getWithdrawsStart = (params) => {
  return {
    type: GET_WithdrawS_START,
    payload: params,
  };
};
export const getWithdrawsSuccess = (data) => {
  return {
    type: GET_WithdrawS_SUCCESS,
    payload: data,
  };
};
