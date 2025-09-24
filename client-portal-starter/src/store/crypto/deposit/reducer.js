import {
  POST_Deposit_FAIL,
  POST_Deposit_START,
  POST_Deposit_SUCCESS,
  GET_DepositS_SUCCESS,
} from "./actionTypes";

const initialState = {
  loading: false,
  error: "",
  deposits: [],
};

const depositReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_Deposit_START:
      return {
        ...state,
        error: "",
        loading: true,
      };
    case POST_Deposit_SUCCESS:
      return {
        ...state,
        error: "",
        loading: false,
      };
    case POST_Deposit_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case GET_DepositS_SUCCESS:
      return {
        ...state,
        loading: false,
        deposits: [...action.payload.docs],
        depositsTotalDocs: action.payload.totalDocs,
      };
    default:
      return state;
  }
};
export default depositReducer;
