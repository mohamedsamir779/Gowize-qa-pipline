import {
  GENERATE_QR_CODE_START,
  GENERATE_QR_CODE_SUCCCESS,
  GENERATE_QR_CODE_ERROR,
  VERIFY_TWO_FACTOR_CODE_FAIL,
  VERIFY_TWO_FACTOR_CODE_START,
  VERIFY_TWO_FACTOR_CODE_SUCCESS
} from "./actionTypes";

const initalState = {
  verifyCode: {
    loading: false
  },
  generateQR: {
    loading: false
  },
};

const twoFactorAuthReducer = (state = { ...initalState }, action)=>{
  switch (action.type){
    // fetch client deposits 
    case GENERATE_QR_CODE_START:
      state = {
        ...state,
        generateQR: {
          loading: true
        },
      };
      break;
    case GENERATE_QR_CODE_SUCCCESS:
      state = {
        ...state,
        generateQR: {
          loading: false,
          success: true,
          qrCode: action.payload
        },
      };
      break;
    case GENERATE_QR_CODE_ERROR:
      state = {
        ...state,
        generateQR: {
          loading: false,
          success: false,
          error: action.payload,
        },
      };
      break;
    case VERIFY_TWO_FACTOR_CODE_START:
      state = {
        ...state,
        verifyCode: {
          loading: true,
        }
      };
      break;
    case VERIFY_TWO_FACTOR_CODE_SUCCESS:
      state = {
        ...state,
        verifyCode: {
          loading: false,
          success: true,
          result: action.payload,
          disabled: action.payload.type === "disable",
        },
        generateQR: {
          ...state.generateQR,
          qrCode: null,
        }
      };
      break;
    case VERIFY_TWO_FACTOR_CODE_FAIL:
      state = {
        ...state,
        verifyCode: {         
          loading: false,
          success: false,
          error: action.payload
        }
      };
      break;
    default:
      state = { ...state };
    
  }
  return state;
};
export default twoFactorAuthReducer;