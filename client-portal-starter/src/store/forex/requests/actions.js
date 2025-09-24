import { 
  REQ_IB_START, 
  GET_IB_REQUEST_STATUS,
  CREATE_CHANGE_LEVERAGE_REQ_REQUESTED,
  CREATE_CHANGE_LEVERAGE_REQ_SUCCESS,
  CREATE_CHANGE_LEVERAGE_REQ_FAIL 
} from "./actionTypes";

export const requestPartnership = (params)=>{
  return {
    type:REQ_IB_START,
    payload:params
  };
};

export const getIbRequestStatus = (params)=>{
  return {
    type:GET_IB_REQUEST_STATUS,
    payload:params
  };
};

// change leverage req
export const createChangeLeverageRequest = (params) => {
  return {
    type: CREATE_CHANGE_LEVERAGE_REQ_REQUESTED,
    payload: params
  };
};
export const createChangeLeverageSuccess = (params) => {
  return {
    type: CREATE_CHANGE_LEVERAGE_REQ_SUCCESS,
    payload: params
  };
};
export const createChangeLeverageFail = (params) => {
  return {
    type: CREATE_CHANGE_LEVERAGE_REQ_FAIL,
    payload: params
  };
};
