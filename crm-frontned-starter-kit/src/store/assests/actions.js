
import {
  FETCH_ASSETS_START,
  FETCH_ASSETS_SUCCESS,
  ADD_NEW_SYMBOL,
  ADD_NEW_SYMBOL_SUCCESS,
  ADD_SYMBOL_CLEAR,
  EDIT_SYMBOL_START,
  EDIT_SYMBOL_DONE,
  EDIT_SYMBOL_CLEAR,
  DELETE_SYMBOL_START,
  DELETE_SYMBOL_DONE,
  API_ERROR
} from "./actionsType";
export const fetchAssetsStart = (params)=>{
  return {
    type:FETCH_ASSETS_START,
    payload:params
  };
};
export const fetchAssetsSuccess = (data)=>{
  return {
    type:FETCH_ASSETS_SUCCESS,
    payload:data
  };
};
export const addNewSymbol = (newSymbol)=>{
  return {
    type:ADD_NEW_SYMBOL,
    payload:{ newSymbol }
  };
};

export const addNewSymbolSuccess = (newSymbol)=>{
  
  return {
    type:ADD_NEW_SYMBOL_SUCCESS,
    payload:newSymbol
    
  };
};
export const editSymbolStart = (params = {})=>{
  return {
    type:EDIT_SYMBOL_START,
    payload:params
  };
};
export const editSymbolSuccess = (data) =>{
  return {
    type:EDIT_SYMBOL_DONE,
    payload:data
  };
};
export const deleteSymbolStart = (params)=>{
  return {
    type:DELETE_SYMBOL_START,
    payload:params
  };
};
export const deleteSymbolDone = (data)=>{
  return {
    type:DELETE_SYMBOL_DONE,
    payload:data
  };
};  
export const assetEditModalClear = (data)=>{
  return {
    type:EDIT_SYMBOL_CLEAR,
    payload:data
  };
};
export const addAssetModalClear = (data)=>{
  return {
    type:ADD_SYMBOL_CLEAR,
    payload:data
  };
};
export const apiError = (error)=>{
  return {
    type:API_ERROR,
    payload:{ error }
  };
};
