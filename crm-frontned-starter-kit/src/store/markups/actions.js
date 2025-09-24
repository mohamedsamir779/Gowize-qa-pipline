import {
  EDIT_MARKUP_CLEAR,
  FETCH_MARKUPS_START,
  FETCH_MARKUPS_SUCCESS,
  MARKUP_EDIT_START,
  MARKUP_EDIT_SUCCESS,
  DELETE_MARKUP_START,
  DELETE_MARKUP_SUCCESS,
  ADD_MARKUP_START,
  ADD_MARKUP_SUCCESS,
  MARKUP_API_ERROR,
  ADD_MARKUP_CLEAR,
  DELETE_MARKUP_CLEAR,
  FETCH_MARKUP_DETAILS_START
} from "./actionTypes";

export const fetchMarkupsStart = (params) => {
  return {
    type: FETCH_MARKUPS_START,
    payload: params
  };
};

export const fetchMarkupsSuccess = (params) => {
  return {
    type: FETCH_MARKUPS_SUCCESS,
    payload: params
  };
};

export const editMarkupStart = (params) => {
  return {
    type: MARKUP_EDIT_START,
    payload: params
  };
};

export const editMarkupSuccess = (params) => {
  return {
    type: MARKUP_EDIT_SUCCESS,
    payload: params
  };
};
export const markupEditModalClear = (data) => {
  return {
    type: EDIT_MARKUP_CLEAR,
    payload: data
  };
};

export const deleteMarkupStart = (id) => {
  return {
    type: DELETE_MARKUP_START,
    payload: id
  };
};

export const deleteMarkupDone = (data) => {
  return {
    type: DELETE_MARKUP_SUCCESS,
    payload: data
  };
};

export const addMarkupStart = (values) => {
  return {
    type: ADD_MARKUP_START,
    payload: values
  };
};

export const addNewMarkupSuccess = (newMarkup) => {
  return {
    type: ADD_MARKUP_SUCCESS,
    payload: newMarkup
  };
};
export const apiError = (error) => {
  return {
    type: MARKUP_API_ERROR,
    payload: error
  };
};
export const addMarkupModalClear = (data) => {
  return {
    type: ADD_MARKUP_CLEAR,
    payload: data
  };
};
export const deletModalClear = (data) => {
  return {
    type: DELETE_MARKUP_CLEAR,
    payload: data
  };
};
export const fetchMarkupDetailsStart = (data) => {
  return {
    type:FETCH_MARKUP_DETAILS_START,
    payload:data
  };
};