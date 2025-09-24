import { 
  RESET_PASSWORD_START, 
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_ERROR,
  CHANGE_PASSWORD_START,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_ERROR,
} from "./actionsType";

export const resetPasswordStart = (payload)=>{
  return {
    type:RESET_PASSWORD_START,
    payload,
  };
};
export const resetPasswordSuccess = ()=>{
  return {
    type:RESET_PASSWORD_SUCCESS
  };
};

export const resetPasswordError = (payload) => {
  return {
    type: RESET_PASSWORD_ERROR,
    payload,
  };
};

export const changePasswordStart = (payload)=>{
  return {
    type:CHANGE_PASSWORD_START,
    payload,
  };
};

export const changePasswordSuccess = ()=>{
  return {
    type:CHANGE_PASSWORD_SUCCESS
  };
};

export const changePasswordError = (payload) => {
  return {
    type: CHANGE_PASSWORD_ERROR,
    payload,
  };
};