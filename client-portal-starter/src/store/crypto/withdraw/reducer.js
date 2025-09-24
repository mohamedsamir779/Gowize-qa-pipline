import {
  POST_Withdraw_FAIL,
  POST_Withdraw_START,
  POST_Withdraw_SUCCESS,
  GET_WithdrawS_SUCCESS,
} from "./actionTypes";

const initialState = {
  loading: false,
  error: "",
  withdraws: [],
};

const withdrawReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_Withdraw_START:
      return {
        ...state,
        error: "",
        loading: true,
      };
    case POST_Withdraw_SUCCESS:
      return {
        ...state,
        error: "",
        loading: false,
      };
    case POST_Withdraw_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case GET_WithdrawS_SUCCESS:
      return {
        ...state,
        loading: false,
        withdraws: [...action.payload.docs],
        withdrawsTotalDocs: action.payload.totalDocs,
      };
    default:
      return state;
  }
};
export default withdrawReducer;
