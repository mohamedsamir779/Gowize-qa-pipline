import {
  MARKETS_UPDATE,
  ORDER_BOOK_UPDATE,
  INITIALIZE_SOCKET_MESSAGES,
} from "./actionTypes";

export const updateMarkets = (params = {}) => {
  return {
    type: MARKETS_UPDATE,
    payload: params,
  };
};

export const updateOrderBooks = (params = {}) => {
  return {
    type: ORDER_BOOK_UPDATE,
    payload: params,
  };
};

export const initSocketMessages = (params = {}) => {
  return {
    type: INITIALIZE_SOCKET_MESSAGES,
    payload: params,
  };
};