import {
  FETCH_GATEWAYS_START, 
  FETCH_GATEWAYS_SUCCESS,
  FETCH_WITHDRAWALS_GATEWAYS_START,
  FETCH_WITHDRAWALS_GATEWAYS_SUCCESS
} from "./actionTypes";

export const fetchGatewaysStart = (params)=>{
  return {
    type:FETCH_GATEWAYS_START,
    payload:params
  };
};
export const fetchGatewaysSuccess = (data)=>{
  return {
    type:FETCH_GATEWAYS_SUCCESS,
    payload:data
  };
};
export const fetchGatewaysOfWithdrawalsStart = (params)=>{
  return {
    type:FETCH_WITHDRAWALS_GATEWAYS_START,
    payload:params
  };
};
export const fetchGatewaysOfWithdrawalsSuccess = (data)=>{
  return {
    type:FETCH_WITHDRAWALS_GATEWAYS_SUCCESS,
    payload:data
  };
};