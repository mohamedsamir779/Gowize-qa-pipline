import {
  RESET_PASSWORD,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_ERROR,
  RESET_PASSWORD_CLEAR
} from "./actionTypes";

const initialState = {
  resetPasswordSuccessMsg: null,
  resetPasswordError: null,
  resetPasswordSuccess: false
};

const resetPasswordReducer = (state = initialState, action) => {
  switch (action.type) {
    case RESET_PASSWORD:
      state = {
        ...state,
        resetPasswordSuccessMsg: null,
        resetPasswordError: null,
      };
      break;
    case RESET_PASSWORD_SUCCESS:
      state = {
        ...state,
        resetPasswordSuccessMsg: action.payload,
      };
      break;
    case RESET_PASSWORD_ERROR:
      state = {
        ...state,
        resetPasswordError: action.payload 
      };
      break;
    case RESET_PASSWORD_CLEAR:
      state = {
        ...state,
        resetPasswordSuccessMsg: null,
        resetPasswordError: null,
        resetPasswordSuccess: true
      };
      break;
      
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default resetPasswordReducer;
