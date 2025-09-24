import {
  FETCH_MARKET_PRICING_START, FETCH_MARKET_PRICING_SUCCESS, FETCH_ORDER_BOOK_START, FETCH_ORDER_BOOK_SUCCCESS
} from "./actionTypes";

const initialState = {
  marketPricingLoading: false,
  orderBooksLoading: false,
  error: "",
  marketPrices:{ docs:[] },
  orderBooks:{ docs:[] }
};

const MarketPricing = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_MARKET_PRICING_START:
      return {
        ...state,
        marketPricingLoading: true
      };
    case FETCH_MARKET_PRICING_SUCCESS:
      return {
        ...state,
        marketPricingLoading: false,
        marketPrices: { ...action.payload.result },
      };
    case FETCH_ORDER_BOOK_START:
      return {
        ...state,
        orderBooksLoading: true,
      };
    case FETCH_ORDER_BOOK_SUCCCESS:
      return {
        ...state,
        orderBooksLoading:false,
        orderBooks: { ...action.payload.result }
      };
    default:
      return state;
  }
};
export default MarketPricing;