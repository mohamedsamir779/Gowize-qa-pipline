import {
  MARKETS_FETCH,
  MARKETS_FETCH_SUCCESSFUL,
  MARKETS_FETCH_FAILED
} from "./actionTypes";

export const fetchMarkets = (params = {}) => {
  return {
    type: MARKETS_FETCH,
    payload: params,
  };
};

export const fetchMarketsSuccessful = markets => {
  return {
    type: MARKETS_FETCH_SUCCESSFUL,
    payload: markets,
  };
};

export const fetchMarketsFailed = markets => {
  return {
    type: MARKETS_FETCH_FAILED,
    payload: markets,
  };
};
