import {
  KLINE_HIGH_FETCH,
  KLINE_HIGH_FETCH_SUCCESSFUL,
  KLINE_HIGH_FETCH_FAILED,
  OHLCV_FETCH,
  OHLCV_FETCH_SUCCESSFUL,
  OHLCV_FETCH_FAILED,
} from "./actionTypes";

export const fetchHighKlines = (timespan = "24h") => {
  return {
    type: KLINE_HIGH_FETCH,
    payload: { timespan },
  };
};

export const fetchHighKlinesSuccessful = hKlines => {
  return {
    type: KLINE_HIGH_FETCH_SUCCESSFUL,
    payload: hKlines,
  };
};

export const fetchHighKlinesFailed = prices => {
  return {
    type: KLINE_HIGH_FETCH_FAILED,
    payload: prices,
  };
};

export const fetchOHLCV = ({
  // default params via destructuring
  since = +new Date(Date.now() - 500 * 60000),
  limit = 500,
  symbol = "BTC/USDT",
  timeframe = "15m"
}) => {
  return {
    type: OHLCV_FETCH,
    payload: {
      since,
      limit,
      symbol,
      timeframe
    },
  };
};

export const fetchOHLCVSuccessful = data => {
  return {
    type: OHLCV_FETCH_SUCCESSFUL,
    payload: data,
  };
};

export const fetchOHLCVFailed = payload => {
  return {
    type: OHLCV_FETCH_FAILED,
    payload,
  };
};
