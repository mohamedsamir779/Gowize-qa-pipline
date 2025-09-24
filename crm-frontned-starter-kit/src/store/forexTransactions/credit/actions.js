import {
  FETCH_CREDITS_REQUESTED,
  FETCH_CREDITS_SUCCESS,
  FETCH_CREDITS_FAIL,

  ADD_CREDIT_REQUESTED,
  ADD_CREDIT_SUCCESS,
  ADD_CREDIT_FAIL,
  ADD_CREDIT_CLEAR,
  ADD_CREDIT_ERROR_CLEAR
} from "./actionTypes";


// fetch credits
export const fetchCredits = (params = {}) => {
  return {
    type: FETCH_CREDITS_REQUESTED,
    payload: params
  };
};
export const fetchCreditsSuccess = (data) => {
  return {
    type: FETCH_CREDITS_SUCCESS,
    payload: data
  };
};
export const fetchCreditsFail = (error) => {
  return {
    type: FETCH_CREDITS_FAIL,
    payload: { error }
  };
};

// add credit
export const addCredit = (params = {}) => {
  return {
    type: ADD_CREDIT_REQUESTED,
    payload: params
  };
};
export const addCreditSuccess = (data) => {
  return {
    type: ADD_CREDIT_SUCCESS,
    payload: data
  };
};
export const addCreditFail = (error) => {
  return {
    type: ADD_CREDIT_FAIL,
    payload: { error }
  };
};
export const addCreditClear = (data) => {
  return {
    type: ADD_CREDIT_CLEAR,
    payload: data
  };
};
export const addCreditErrorClear = () => {
  return {
    type: ADD_CREDIT_ERROR_CLEAR
  };
};