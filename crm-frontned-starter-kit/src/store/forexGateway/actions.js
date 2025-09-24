import {
  FETCH_FOREX_DEPOSITS_GATEWAYS_START, 
  FETCH_FOREX_DEPOSITS_GATEWAYS_SUCCESS,
  FETCH_FOREX_WITHDRAWALS_GATEWAYS_START,
  FETCH_FOREX_WITHDRAWALS_GATEWAYS_SUCCESS
} from "./actionTypes";

export const fetchForexDepositsGatewaysStart = (params)=>{
  return {
    type: FETCH_FOREX_DEPOSITS_GATEWAYS_START,
    payload: params
  };
};
export const fetchForexDepositsGatewaysSuccess = (data)=>{
  return {
    type: FETCH_FOREX_DEPOSITS_GATEWAYS_SUCCESS,
    payload: data
  };
};

export const fetchForexWithdrawalsGatewaysStart = (params)=>{
  return {
    type: FETCH_FOREX_WITHDRAWALS_GATEWAYS_START,
    payload: params
  };
};
export const fetchForexWithdrawalsGatewaysSuccess = (data)=>{
  return {
    type: FETCH_FOREX_WITHDRAWALS_GATEWAYS_SUCCESS,
    payload: data
  };
};