import {
  FETCH_TRANSACTION_FEE_GROUPS_START,
  FETCH_TRANSACTION_FEE_GROUPS_SUCCESS,
  API_ERROR,
  ADD_TRANSACTION_FEES_GROUPS_START,
  ADD_TRANSACTION_FEES_GROUP_SUCCESS,
  EDIT_TRANSACTION_FEE_GROUP_START,
  EDIT_TRANSACTION_FEE_GROUP_SUCCESS,
  DELETE_TRANSACTION_FEE_GROUP_START,
  DELETE_TRANSACTION_FEE_GROUP_SUCCESS,
  ADD_MODAL_CLEAR,
  EDIT_MODAL_CLEAR,
  DELETE_MODAL_CLEAR
} from "./actionsType";
export const fetchTransactionFeeGroupStart = (params)=>{
  return {
    type:FETCH_TRANSACTION_FEE_GROUPS_START,
    payload:{ params }
  };
};
export const fetchTransactionFeeGroupsSuccess = (data)=>{
  return {
    type:FETCH_TRANSACTION_FEE_GROUPS_SUCCESS,
    payload:data
  };
};
export const apiError = (error)=> {
  return {
    type:API_ERROR,
    payload:{ error }
  };
};
export const addTransactionFeesGroupStart = (body)=>{
  return {
    type:ADD_TRANSACTION_FEES_GROUPS_START,
    payload:body 
  };
};
export const addTransactionFeeGroupSuccess = (data)=>{
  return {
    type:ADD_TRANSACTION_FEES_GROUP_SUCCESS,
    payload:data

  };
};
export const editTransactionFeeGroupStart = (id, body)=>{
  return {
    type:EDIT_TRANSACTION_FEE_GROUP_START,
    payload:{
      id,
      body
    }
  };
};
export const editTransactionFeeGroupSuccess = (data)=>{
  return {
    type:EDIT_TRANSACTION_FEE_GROUP_SUCCESS,
    payload:data 
  };
};
export const deleteTransactionFeeGroupStart = (id)=>{
  return {
    type:DELETE_TRANSACTION_FEE_GROUP_START,
    payload:{ id }
  };
};
export const deleteTransactionFeeGroupSuccess = (id)=>{
  return {
    type: DELETE_TRANSACTION_FEE_GROUP_SUCCESS,
    payload:{ id } 
  };
};
export const addModalClear = ()=>{
  return {
    type:ADD_MODAL_CLEAR
  };
};
export const editModalClear = ()=>{
  return {
    type:EDIT_MODAL_CLEAR,

  };
};
export const deleteModalClear = ()=>{
  return {
    type: DELETE_MODAL_CLEAR
  };
};