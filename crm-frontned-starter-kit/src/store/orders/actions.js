import {
  FETCH_ORDERS_REQUESTED,
  FETCH_ORDERS_SUCCESS,
  FETCH_ORDERS_FAIL,

  ADD_ORDER_REQUESTED,
  ADD_ORDER_SUCCESS,
  ADD_ORDER_FAIL,
  ADD_ORDER_CLEAR,

  DELETE_ORDER_REQUESTED,
  DELETE_ORDER_SUCCESS,
  DELETE_ORDER_FAIL,

} from "./actionTypes";

// fetch
export const fetchOrders = (params = {}) => {
  return {
    type: FETCH_ORDERS_REQUESTED,
    payload: params
  };
};
export const fetchOrdersSuccess = (data) => {
  return {
    type: FETCH_ORDERS_SUCCESS,
    payload: data
  };
};
export const fetchOrdersFail = (error) => {
  return {
    type: FETCH_ORDERS_FAIL,
    payload: { error }
  };
}; 


// add
export const addOrder = (params = {}) => {
  return {
    type: ADD_ORDER_REQUESTED,
    payload: params
  };
};
export const addOrderSuccess = (data) => {
  return {
    type: ADD_ORDER_SUCCESS,
    payload: data
  };
};
export const addOrderFail = (error) => {
  return {
    type: ADD_ORDER_FAIL,
    payload: { error }
  };
};
export const addOrderClear = (data) => {
  return {
    type: ADD_ORDER_CLEAR,
    payload: data
  };
};

// delete
export const deleteOrder = (params = {}) => {
  return {
    type: DELETE_ORDER_REQUESTED,
    payload: params
  };
};
export const deleteOrderSuccess = (data) => {
  return {
    type: DELETE_ORDER_SUCCESS,
    payload: data
  };
};
export const deleteOrderFail = (error) => {
  return {
    type: DELETE_ORDER_FAIL,
    payload: { error }
  };
}; 