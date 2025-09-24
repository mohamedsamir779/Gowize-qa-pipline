import {
  ORDER_BOOKS_FETCH,
  ORDER_BOOKS_FETCH_SUCCESSFUL,
  ORDER_BOOKS_FETCH_FAILED
} from "./actionTypes";

export const fetchOrderBooks = (params = {}) => {
  return {
    type: ORDER_BOOKS_FETCH,
    payload: params,
  };
};

export const fetchOrderBooksSuccessful = orderBooks => {
  return {
    type: ORDER_BOOKS_FETCH_SUCCESSFUL,
    payload: orderBooks,
  };
};

export const fetchOrderBooksFailed = orderBooks => {
  return {
    type: ORDER_BOOKS_FETCH_FAILED,
    payload: orderBooks,
  };
};
