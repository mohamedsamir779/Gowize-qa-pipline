import {
  FETCH_REPORTS_START,
  FETCH_REPORTS_SUCCESS,
} from "./actionTypes";

export const fetchReportStart = (params = {})=>{
  return {
    type:FETCH_REPORTS_START,
    payload: params
  };
};

export const fetchReportEnd = (data)=>{
  return {
    type:FETCH_REPORTS_SUCCESS,
    payload: data
  };
};