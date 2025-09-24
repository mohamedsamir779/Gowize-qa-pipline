import {
  GENERATE_QR_CODE_START, 
  GENERATE_QR_CODE_SUCCCESS,
  GENERATE_QR_CODE_ERROR,
  VERIFY_TWO_FACTOR_CODE_START,
  VERIFY_TWO_FACTOR_CODE_SUCCESS,
  VERIFY_TWO_FACTOR_CODE_FAIL 
} from "./actionTypes";

export const verify2FACodeStart = (payload) =>{
  return {
    type: VERIFY_TWO_FACTOR_CODE_START,
    payload
  };
};

export const generateQRCodeStart = (payload)=>{
  return {
    type: GENERATE_QR_CODE_START,
    payload
  };
};

export const verify2FACodeSuccess = (payload)=>{
  return {
    type: VERIFY_TWO_FACTOR_CODE_SUCCESS,
    payload
  };
};

export const verify2FACodeFail = (payload)=>{
  return {
    type: VERIFY_TWO_FACTOR_CODE_FAIL,
    payload
  };
};

export const generateQRCodeSuccess = (payload)=>{
  return {
    type: GENERATE_QR_CODE_SUCCCESS,
    payload
  };
};

export const generateQRCodeError = (payload)=>{
  return {
    type: GENERATE_QR_CODE_ERROR,
    payload
  };
};