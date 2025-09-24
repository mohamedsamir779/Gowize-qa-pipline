import {
  FETCH_IB_AGREEMENTS_START, FETCH_IB_AGREEMENTS_SUCCESS,
  FETCH_REFERRALS_START, FETCH_REFERRALS_SUCCESS,
  FETCH_STATEMENT_START, FETCH_STATEMENT_SUCCESS,
  FETCH_STATEMENT_DEALS_START, FETCH_STATEMENT_DEALS_SUCCESS,
} from "./actionTypes";

export const fetchAgreements = (data) => {
  return {
    type: FETCH_IB_AGREEMENTS_START,
    payload: data
  };
};
export const fetchAgreementsSuccess = (data) => {
  return {
    type: FETCH_IB_AGREEMENTS_SUCCESS,
    payload: data
  };
};

export const fetchReferrals = (params = {}) => {
  return {
    type: FETCH_REFERRALS_START,
    payload: params
  };
};
export const fetchReferralsSuccess = (data) => {
  return {
    type: FETCH_REFERRALS_SUCCESS,
    payload: data
  };
};
export const fetchStatement = (params = {}) => {
  return {
    type: FETCH_STATEMENT_START,
    payload: params
  };
};
export const fetchStatementSuccess = (data) => {
  return {
    type: FETCH_STATEMENT_SUCCESS,
    payload: data
  };
};
export const fetchStatementDeals = (params = {}) => {
  return {
    type: FETCH_STATEMENT_DEALS_START,
    payload: params
  };
};
export const fetchStatementDealsSuccess = (data) => {
  return {
    type: FETCH_STATEMENT_DEALS_SUCCESS,
    payload: data
  };
};
