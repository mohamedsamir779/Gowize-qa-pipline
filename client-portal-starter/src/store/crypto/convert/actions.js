const {
  CONVERT_START,
  CONVERT_SUCCESS,
  CONVERT_FAIL,
  PREVIEW_CONVERSION_START,
  PREVIEW_CONVERSION_SUCCESS,
  PREVIEW_CONVERSION_FAIL,
  RESET_CONVERT_STATE
} = require("./actionTypes");

export const convertStart = (payload)=>{
  return {
    type:CONVERT_START,
    payload
  };
};

export const convertSuccess = (payload)=>{
  return {
    type:CONVERT_SUCCESS,
    payload
  };
};

export const convertFailure = (payload)=>{
  return {
    type:CONVERT_FAIL,
    payload
  };
};

export const previewConversion = (payload)=>{
  return {
    type:PREVIEW_CONVERSION_START,
    payload
  };
};

export const previewConversionSuccess = (payload)=>{
  return {
    type:PREVIEW_CONVERSION_SUCCESS,
    payload
  };
};

export const previewConversionFail = (payload)=>{
  return {
    type:PREVIEW_CONVERSION_FAIL,
    payload
  };
};

export const resetConvert = (payload)=>{
  return {
    type:RESET_CONVERT_STATE,
    payload:payload
  };
};