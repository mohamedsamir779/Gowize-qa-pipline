import {
  FETCH_FEE_GROUPS_START,
  FETCH_FEE_GROUPS_SUCCESS,
  API_ERROR,
  ADD_FEES_GROUPS_START,
  ADD_FEES_GROUP_SUCCESS,
  EDIT_FEE_GROUP_START,
  EDIT_FEE_GROUP_SUCCESS,
  DELETE_FEE_GROUP_START,
  DELETE_FEE_GROUP_SUCCESS,
  ADD_MODAL_CLEAR,
  EDIT_MODAL_CLEAR,
  DELETE_MODAL_CLEAR
} from "./actionsType";
export const fetchFeeGroupStart = (params)=>{
  return {
    type:FETCH_FEE_GROUPS_START,
    payload:{ params }
  };
};
export const fetchFeeGroupsSuccess = (data)=>{
  return {
    type:FETCH_FEE_GROUPS_SUCCESS,
    payload:data
  };
};
export const apiError = (error)=> {
  return {
    type:API_ERROR,
    payload:{ error }
  };
};
export const addFeesGroupStart = (body)=>{
  return {
    type:ADD_FEES_GROUPS_START,
    payload:body 
  };
};
export const addFeeGroupSuccess = (data)=>{
  return {
    type:ADD_FEES_GROUP_SUCCESS,
    payload:data

  };
};
export const editFeeGroupStart = (id, body)=>{
  return {
    type:EDIT_FEE_GROUP_START,
    payload:{
      id,
      body
    }
  };
};
export const editFeeGroupSuccess = (data)=>{
  return {
    type:EDIT_FEE_GROUP_SUCCESS,
    payload:data 
  };
};
export const deleteFeeGroupStart = (id)=>{
  return {
    type:DELETE_FEE_GROUP_START,
    payload:{ id }
  };
};
export const deleteFeeGroupSuccess = (id)=>{
  return {
    type: DELETE_FEE_GROUP_SUCCESS,
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