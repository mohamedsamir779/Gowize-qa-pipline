import {
  FETCH_WITHDRAWALS_GATEWAYS_START, FETCH_WITHDRAWALS_GATEWAYS_SUCCESS,
  GET_IB_DEPOSITS_START, GET_IB_WITHDRAWS_START, IB_INTERNAL_TRANSFER_START,
  ADD_WITHDRAWAL_REQUESTED, ADD_WITHDRAWAL_SUCCESS, ADD_WITHDRAWAL_FAIL,
  IB_INTERNAL_TRANSFER_FAILED
} from "./actionTypes";

export const fetchWithdrawalsGatewaysStart = (params) => {
  return {
    type: FETCH_WITHDRAWALS_GATEWAYS_START,
    payload: params
  };
};
export const fetchWithdrawalsGatewaysSuccess = (data) => {
  return {
    type: FETCH_WITHDRAWALS_GATEWAYS_SUCCESS,
    payload: data
  };
};

export const addWithdrawal = (params = {}) => {
  return {
    type: ADD_WITHDRAWAL_REQUESTED,
    payload: params
  };
};
export const addWithdrawalSuccess = (data) => {
  return {
    type: ADD_WITHDRAWAL_SUCCESS,
    payload: data
  };
};
export const addWithdrawalFail = (error) => {
  return {
    type: ADD_WITHDRAWAL_FAIL,
    payload: { error }
  };
};

export const getIbDeposits = (params) => {
  return {
    type: GET_IB_DEPOSITS_START,
    payload: params
  };
};

export const getIbWithdraws = (params) => {
  return {
    type: GET_IB_WITHDRAWS_START,
    payload: params
  };
};

export const ibInternalTransfer = (params) => {
  return {
    type: IB_INTERNAL_TRANSFER_START,
    payload: params
  };
};
export const ibInternalTransferFailed = (error) => {
  return {
    type: IB_INTERNAL_TRANSFER_FAILED,
    payload: { error }
  };
};