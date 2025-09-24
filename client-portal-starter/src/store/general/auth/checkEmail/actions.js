import {
  CHECK_USER,
  CHECK_USER_FAILED,
  CHECK_USER_SUCCESSFUL
} from "./actionTypes";
  
export const checkUserExist = (email) => {
  return {
    type: CHECK_USER,
    payload: email
    
  };
};
  
export const checkUserExistSuccess = message => {
  return {
    type: CHECK_USER_SUCCESSFUL,
    payload: message,
  };
};
  
export const checkUserExistError = message => {
  return {
    type: CHECK_USER_FAILED,
    payload: message,
  };
};