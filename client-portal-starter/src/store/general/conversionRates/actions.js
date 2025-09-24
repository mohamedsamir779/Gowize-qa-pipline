import { FETCH_CONVERSION_RATES_START, FETCH_CONVERSION_RATES_SUCCESS } from "./actionTypes";

export const fetchConversionRateStart = ({ from, to }) => {
  return {
    type: FETCH_CONVERSION_RATES_START,
    payload: {
      baseCurrency: from,
      targetCurrency: to
    }
  };
};

export const fetchConversionRateSuccess = (data) => {
  return {
    type: FETCH_CONVERSION_RATES_SUCCESS,
    payload: data
  };
};
