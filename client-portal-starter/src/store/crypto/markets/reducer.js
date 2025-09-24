
import { MARKETS_UPDATE } from "../../general/sockets/actionTypes";
import {
  MARKETS_FETCH,
  MARKETS_FETCH_SUCCESSFUL,
  MARKETS_FETCH_FAILED,
} from "./actionTypes";

const initialState = {
  loading: false,
  error: "",
  markets: [],
  marketNames: [],
  clearingCounter: 0,
  editClearingCounter: 0,
  deleteClearingCounter: 0,
};

const updateMarkets = (currentMarkets, newData) => {
  let updatedData = currentMarkets;
  updatedData = updatedData.map((market) => {
    const found = newData.find((x) => x.pairName === market.pairName);
    return {
      ...market,
      ...found
    };
  });
  return updatedData;
};

const getMarketNames = (markets) => {
  return markets ? markets.map(m => m.pairName ) : [];
};

const marketsReducer = (state = initialState, action) => {
  // eslint-disable-next-line default-case
  switch (action.type) {
    case MARKETS_FETCH:
      state = {
        ...state,
        loading: true,
      };
      break;
    case MARKETS_UPDATE:
      // eslint-disable-next-line no-case-declarations
      const markets = updateMarkets(state.markets, action.payload);
      state = {
        ...state,
        markets,
      };
      break;
    case MARKETS_FETCH_SUCCESSFUL: 
      const marketNames = getMarketNames(action.payload);
      state = {
        ...state,
        loading: false,
        markets: action.payload,
        marketNames,
      };
      break;
    case MARKETS_FETCH_FAILED: 
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

export default marketsReducer;
