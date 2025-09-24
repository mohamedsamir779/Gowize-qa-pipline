import { 
  GET_LOGS_FAIL,
  GET_LOGS_START,
  GET_LOGS_SUCCESS,
} from "./actionTypes";

export const fetchLogs = (payload) => {
  return {
    type: GET_LOGS_START,
    payload
  };
};

export const fetchLogsSuccess = (params = {}) => {
  return {
    type: GET_LOGS_SUCCESS,
    payload: params
  };
};

export const fetchLogsFail = (params = {}) => {
  return {
    type: GET_LOGS_FAIL,
    payload: params

  };
};