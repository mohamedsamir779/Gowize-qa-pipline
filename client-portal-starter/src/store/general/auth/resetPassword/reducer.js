import {
  RESET_PASSWORD_START,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_ERROR,
  CHANGE_PASSWORD_START,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_ERROR,
} from "./actionsType";
const initialState = {
  error:"",
  loading:false,
  success: false,
};
const resetPasswordReducer = (state = initialState, action) => {
  switch (action.type) {
    case RESET_PASSWORD_START:
      return state = {
        ...state,
        loading:true
      };
    case RESET_PASSWORD_SUCCESS:
      return  state = {
        ...state,
        loading:false,
        success: true,
      };
    case RESET_PASSWORD_ERROR:
      return  state = {
        ...state,
        error: true,
        showErrorMessage: true,
        loading: false,
        success: false,
        message: action?.payload?.message || "Error resetting the password",
      };
    case CHANGE_PASSWORD_START:
      return state = {
        ...state,
        loading: true,
      };
    case CHANGE_PASSWORD_SUCCESS:
      return state = {
        ...state,
        loading: false,
      };
    case CHANGE_PASSWORD_ERROR:
      return state = {
        ...state,
        loading: false,
      };
    default:
      return { ...state };
  }
};
export default resetPasswordReducer;