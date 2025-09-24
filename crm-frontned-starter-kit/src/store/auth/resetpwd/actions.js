import {
  RESET_PASSWORD,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_ERROR,
  RESET_PASSWORD_CLEAR,
} from "./actionTypes";

export const resetPassword = (payload) => {
  return {
    type: RESET_PASSWORD,
    payload: payload,
  };
};
export const resetPasswordSuccess = (message) => {
  return {
    type: RESET_PASSWORD_SUCCESS,
    payload: message,
  };
};
export const resetPasswordFail = (message) => {
  return {
    type: RESET_PASSWORD_ERROR,
    payload: message,
  };
};
export const resetPasswordClear = (message) => {
  return {
    type: RESET_PASSWORD_CLEAR,
    payload: message,
  };
};
