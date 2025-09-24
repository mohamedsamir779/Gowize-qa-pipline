import { 
  POST_ORDER_START, 
  POST_ORDER_SUCCESS, 
  POST_ORDER_FAIL,
  GET_ORDERS_START,
  GET_ORDERS_SUCCESS
} from "./actionTypes";

export const makeOrder = (payload) => {
  return {
    type: POST_ORDER_START,
    payload
  };
};

export const postOrderSuccess = (params = {}) => {
  return {
    type: POST_ORDER_SUCCESS,
    payload: params
  };
};
export const postOrderFail = (params = {}) => {
  return {
    type: POST_ORDER_FAIL,
    payload: params

  };
};
export const getOrdersStart = (params)=>{
  return {
    type:GET_ORDERS_START,
    payload:params
  };
};
export const getOrdersSuccess = (data)=>{
  return {
    type:GET_ORDERS_SUCCESS,
    payload:data
  };
};