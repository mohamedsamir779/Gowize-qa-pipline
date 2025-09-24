import {
  FETCH_CUSTOMERS_COUNTRIES_START,
  FETCH_CUSTOMERS_COUNTRIES_END,
  FETCH_CUSTOMERS_STATS_START,
  FETCH_CUSTOMERS_STATS_END,
  FETCH_LEAD_STAGES_STATS_START,
  FETCH_LEAD_STAGES_STATS_SUCCESS,
  FETCH_LEAD_STAGES_STATS_FAILED
} from "./actionTypes";

export const fetchCustomerCountriesStart = (params = {}) => {
  return {
    type: FETCH_CUSTOMERS_COUNTRIES_START,
    payload: params
  };
};
export const fetchCustomerCountriesEnd = (data) => {
  return {
    type: FETCH_CUSTOMERS_COUNTRIES_END,
    payload: data
  };
};

export const fetchCustomerStatsStart = (params = {}) => {
  return {
    type: FETCH_CUSTOMERS_STATS_START,
    payload: params
  };
};

export const fetchCustomerStatsEnd = (data) => {
  return {
    type: FETCH_CUSTOMERS_STATS_END,
    payload: data
  };
};

export const fetchLeadStagesStatsStart = (params = {}) => {
  return {
    type: FETCH_LEAD_STAGES_STATS_START,
    payload: params
  };
};

export const fetchLeadStagesStatsSuccess = (data) => {
  return {
    type: FETCH_LEAD_STAGES_STATS_SUCCESS,
    payload: data
  };
};

export const fetchLeadStagesStatsFailed = (error) => {
  return {
    type: FETCH_LEAD_STAGES_STATS_FAILED,
    payload: error
  };
};
