import { FETCH_ORDERS_PROFITS_START, FETCH_ORDERS_PROFITS_SUCCESS } from "./actionTypes";

export const fetchOrdersProfits = (params = {}) =>{
  return {
    type:FETCH_ORDERS_PROFITS_START,
    payload:params
  };
};

export const fetchOrdersProfitsSuccess = (params = {}) =>{
  return {
    type:FETCH_ORDERS_PROFITS_SUCCESS,
    payload:params
  };
};