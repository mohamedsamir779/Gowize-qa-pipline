import {
  CHECK_USER, 
  CHECK_USER_FAILED,
  CHECK_USER_SUCCESSFUL
} from "./actionTypes";

const initialState = {
  checkUserSuccessMsg: null,
  checkError: null,
  loading: false,
};

const checkUser = (state = initialState, action) => {
  switch (action.type) {
    case CHECK_USER:
      state = {
        ...state,
        checkUserSuccessMsg: null,
        checkError: null,
        loading: true,
      };
      break;
    case CHECK_USER_SUCCESSFUL:
      state = {
        ...state,
        checkUserSuccessMsg: action.payload,
        loading: false,
      };
      break;
    case CHECK_USER_FAILED:
      state = {
        ...state,
        checkError: action.payload,
        loading: false,
      };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default checkUser;
