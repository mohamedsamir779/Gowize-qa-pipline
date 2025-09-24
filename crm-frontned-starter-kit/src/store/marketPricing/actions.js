import {
  FETCH_MARKET_PRICING_START, FETCH_MARKET_PRICING_SUCCESS, FETCH_ORDER_BOOK_START, FETCH_ORDER_BOOK_SUCCCESS
} from "./actionTypes";

export const fetchPricingStart = (payload) => {
  return {
    type: FETCH_MARKET_PRICING_START,
    payload
  };
};

export const fetchMarketPriceSuccess = (payload) => {
  return {
    type: FETCH_MARKET_PRICING_SUCCESS,
    payload
  };
};

export const fetchOrderBook = (payload) => {
  return {
    type: FETCH_ORDER_BOOK_START,
    payload
  };
};

export const fetchOrderBookSuccess = (payload) => {
  return {
    type:FETCH_ORDER_BOOK_SUCCCESS,
    payload
  };
};