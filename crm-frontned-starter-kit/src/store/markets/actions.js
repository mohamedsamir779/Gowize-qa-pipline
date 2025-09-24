import {
  ADD_MARKET_ERROR, 
  FETCH_MARKETS_START,
  FETCH_MARKETS_SUCCESS, 
  ADD_NEW_MARKET,
  ADD_NEW_MARKET_SUCCESS,
  ADD_MARKET_CLEAR, 
  EDIT_MARKET_START, 
  EDIT_MARKET_SUCCESS,
  EDIT_MARKET_CLEAR,

  CHANGE_MARKET_STATUS_REQUESTED,
  CHANGE_MARKET_STATUS_DONE
} from "./actionTypes";

export const fetchMarketsStart = (params) => {
  return {
    type:FETCH_MARKETS_START,
    payload:params
  };
};
export const fetchMarketsSuccess = (params) => {
  return {
    type:FETCH_MARKETS_SUCCESS,
    payload:params
  };
};
export const addNewMarket = (newMarket)=>{
  return {
    type:ADD_NEW_MARKET,
    payload:{ newMarket }
  };
};
export const addMarketModalClear = (data)=>{
  return {
    type:ADD_MARKET_CLEAR,
    payload:data
  };
};
export const addNewMarketError = (error)=>{
  return {
    type:ADD_MARKET_ERROR,
    payload: error 
  };
};
export const apiError = ()=>{
  return {
    // type:ADD_MARKET_ERROR,
    // payload:{ error }
  };
};
export const addNewMarketSuccess = (newMarket)=>{
  return {
    type:ADD_NEW_MARKET_SUCCESS,
    payload:{
      newMarket
    }
  };
};
export const editMarketStart = (params)=>{
  return {
    type:EDIT_MARKET_START,
    payload:params
  };
};
export const editMarketSuccess = (params)=>{
  return {
    type:EDIT_MARKET_SUCCESS,
    payload:params
  };
};
export const marketEditModalClear = (data)=>{
  return {
    type:EDIT_MARKET_CLEAR,
    payload:data
  };
};

// change market status
export const changeMarketStatus = (id, index, status) => {
  return {
    type: CHANGE_MARKET_STATUS_REQUESTED,
    payload: {
      id,
      index,
      status
    }
  };
};
export const changeMarketStatusDone = (params = {}) => {
  return {
    type: CHANGE_MARKET_STATUS_DONE,
    payload: params
  };
};