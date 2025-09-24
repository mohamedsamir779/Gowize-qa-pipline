
import {
  KLINE_HIGH_FETCH,
  KLINE_HIGH_FETCH_SUCCESSFUL,
  KLINE_HIGH_FETCH_FAILED,
  OHLCV_FETCH,
  OHLCV_FETCH_SUCCESSFUL,
  OHLCV_FETCH_FAILED,
} from "./actionTypes";

const initialState = {
  loading: false,
  error: "",
  highKlines: [{
    name: "",
    data: []
  }],
  klines: {
    symbol: "",
    data: []
  },
  marketNames: [],
};

const klineReducer = (state = initialState, action) => {
  switch (action.type) {
    case KLINE_HIGH_FETCH:
    case OHLCV_FETCH:
      state = {
        ...state,
        loading: true,
      };
      break;
    case KLINE_HIGH_FETCH_SUCCESSFUL:
      state = {
        ...state,
        loading: false,
        highKlines: action.payload,
      };
      break;
    case OHLCV_FETCH_SUCCESSFUL:
      state = {
        ...state,
        loading: false,
        klines: action.payload,
      };
      break;
    case KLINE_HIGH_FETCH_FAILED:
    case OHLCV_FETCH_FAILED:
      state = {
        ...state,
        loading: false,
        error: action.payload.error
      };
      break;
    default:
      state = { ...state };
  }
  return state;
};

export default klineReducer;
