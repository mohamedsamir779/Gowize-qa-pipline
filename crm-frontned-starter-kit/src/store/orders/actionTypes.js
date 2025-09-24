// fetch
// the REQUESTED action type is just a part of a pattern in redux saga 
// it just means that an action was called but didn't return a value yet
// just like a promise REQUESTED = pending, SUCCESS = resolved, FAIL = rejected
export const FETCH_ORDERS_REQUESTED = "FETCH_ORDERS_REQUESTED";
export const FETCH_ORDERS_SUCCESS = "FETCH_ORDERS_SUCCESS";
export const FETCH_ORDERS_FAIL = "FETCH_ORDERS_FAIL";
// add
export const ADD_ORDER_REQUESTED = "ADD_ORDER_REQUESTED";
export const ADD_ORDER_SUCCESS = "ADD_ORDER_SUCCESS";
export const ADD_ORDER_FAIL = "ADD_ORDER_FAIL";
export const ADD_ORDER_CLEAR = "ADD_ORDER_CLEAR";

// delete
export const DELETE_ORDER_REQUESTED = "DELETE_ORDER_REQUESTED";
export const DELETE_ORDER_SUCCESS = "DELETE_ORDER_SUCCESS";
export const DELETE_ORDER_FAIL = "DELETE_ORDER_FAIL"; 