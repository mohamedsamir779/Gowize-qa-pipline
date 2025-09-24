import {
  CONVERT_FAIL, CONVERT_START, CONVERT_SUCCESS, PREVIEW_CONVERSION_FAIL, PREVIEW_CONVERSION_START, PREVIEW_CONVERSION_SUCCESS, RESET_CONVERT_STATE 
} from "./actionTypes";

const initialState = {
  loading: false,
  error: "",
  result:"",
  step: "preview_conversion",
  previewConversion:{
    loading: false,
    error: "",
    result: ""
  }
};

const convertReducer = (state = initialState, action) => {
  switch (action.type) {
    case CONVERT_START:
      return {
        ...state,
        step:"convert",
        loading: true,
        error: "",
        result:"",
      };
    case CONVERT_SUCCESS:
      return {
        ...state,
        step:"convert",
        loading:false,
        error:"",
        result:"Successfully converted"
      };
    case CONVERT_FAIL:
      return {
        ...state,
        step:"convert",
        loading:false,
        error:action.payload,
        result:""
      };
    case PREVIEW_CONVERSION_START:
      return {
        ...state,
        previewConversion:{
          loading:true,
          error:"",
          success:"",
          result:"",
        },
      };
    case PREVIEW_CONVERSION_SUCCESS:
      return {
        ...state,
        step:"convert",
        previewConversion: {
          loading: false,
          error: "",
          success: action.payload.message,
          result: action.payload.result        
        },
      };
    case PREVIEW_CONVERSION_FAIL:
      return {
        ...state,
        step:"convert",
        previewConversion:{
          start:true,
          loading:false,
          error:action.payload,
          success:"",
        },
      };
    case RESET_CONVERT_STATE:
      return initialState;
    default:
      return { ...state };
  }
};
export default convertReducer;