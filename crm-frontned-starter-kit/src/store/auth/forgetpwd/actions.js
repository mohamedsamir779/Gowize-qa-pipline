import {
  FORGET_PASSWORD,
  FORGET_PASSWORD_SUCCESS,
  FORGET_PASSWORD_ERROR,
  FORGET_PASSWORD_CLEAR,
} from "./actionTypes";

export const userForgetPassword = (email) => {
  return {
    type: FORGET_PASSWORD,
    payload: { email },
  };
};
export const userForgetPasswordSuccess = (message) => {
  return {
    type: FORGET_PASSWORD_SUCCESS,
    payload: message,
  };
};
export const userForgetPasswordError = (message) => {
  return {
    type: FORGET_PASSWORD_ERROR,
    payload: message,
  };
};
export const userForgetPasswordClear = (message) => {
  return {
    type: FORGET_PASSWORD_CLEAR,
    payload: message,
  };
};