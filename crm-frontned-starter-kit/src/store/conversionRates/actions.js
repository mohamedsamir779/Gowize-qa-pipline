import {
  ADD_CONVERSION_RATES_ERROR,
  ADD_CONVERSION_RATES_START,
  ADD_CONVERSION_RATES_SUCCESS,
  EDIT_CONVERSION_RATES_ERROR,
  EDIT_CONVERSION_RATES_START,
  EDIT_CONVERSION_RATES_SUCCESS,
  FETCH_CONVERSION_RATES_ERROR,
  FETCH_CONVERSION_RATES_START,
  FETCH_CONVERSION_RATES_SUCCESS
} from "./actionTypes";


export const fetchConversionRates = (params = {}) => {
  return {
    type: FETCH_CONVERSION_RATES_START,
    payload: params
  };
};

export const fetchConversionRatesSuccess = (data) => {
  return {
    type: FETCH_CONVERSION_RATES_SUCCESS,
    payload: data
  };
};

export const fetchConversionRatesError = (error) => {
  return {
    type: FETCH_CONVERSION_RATES_ERROR,
    payload: { error }
  };
};

export const addConversionRates = (params = {}) => {
  return {
    type: ADD_CONVERSION_RATES_START,
    payload: params
  };
};

export const addConversionRatesSuccess = (data) => {
  return {
    type: ADD_CONVERSION_RATES_SUCCESS,
    payload: data
  };
};

export const addConversionRatesError = (error) => {
  return {
    type: ADD_CONVERSION_RATES_ERROR,
    payload: { error }
  };
};

export const editConversionRates = (params = {}) => {
  return {
    type: EDIT_CONVERSION_RATES_START,
    payload: params
  };
};

export const editConversionRatesSuccess = (data) => {
  return {
    type: EDIT_CONVERSION_RATES_SUCCESS,
    payload: data
  };
};

export const editConversionRatesError = (error) => {
  return {
    type: EDIT_CONVERSION_RATES_ERROR,
    payload: { error }
  };
};
