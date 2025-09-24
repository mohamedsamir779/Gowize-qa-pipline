import {
  FETCH_CONVERTS_REQUESTED,
  FETCH_CONVERTS_SUCCESS,
  FETCH_CONVERTS_FAIL,

  ADD_CONVERT_REQUESTED,
  ADD_CONVERT_SUCCESS,
  ADD_CONVERT_FAIL,
  ADD_CONVERT_CLEAR,
  ADD_CONVERT_ERROR_CLEAR
} from "./actionTypes";

// fetch converts
export const fetchConverts = (params = {}) => {
  return {
    type: FETCH_CONVERTS_REQUESTED,
    payload: params
  };
};
export const fetchConvertsSuccess = (data) => {
  return {
    type: FETCH_CONVERTS_SUCCESS,
    payload: data
  };
};
export const fetchConvertsFail = (error) => {
  return {
    type: FETCH_CONVERTS_FAIL,
    payload: { error }
  };
};

// add convert
export const addConvert = (params = {}) => {
  return {
    type: ADD_CONVERT_REQUESTED,
    payload: params
  };
};
export const addConvertSuccess = (data) => {
  return {
    type: ADD_CONVERT_SUCCESS,
    payload: data
  };
};
export const addConvertFail = (error) => {
  return {
    type: ADD_CONVERT_FAIL,
    payload: { error }
  };
};
export const addConvertClear = (data) => {
  return {
    type: ADD_CONVERT_CLEAR,
    payload: data 
  };
};
export const addConvertErrorClear = () => {
  return {
    type: ADD_CONVERT_ERROR_CLEAR
  };
};