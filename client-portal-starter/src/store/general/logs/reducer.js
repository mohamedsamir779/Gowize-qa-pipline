import { 
  GET_LOGS_FAIL,
  GET_LOGS_START,
  GET_LOGS_SUCCESS,
} from "./actionTypes";

const initialState = {
  loading: false,
  error: "",
  logs: {},
  logsLoaded: false,
};

const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_LOGS_START:
      return {
        ...state,
        error:"",
        loading: true
      };
    case GET_LOGS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case GET_LOGS_SUCCESS:
      return {
        ...state,
        loading: false,
        logs: action.payload,
        logsLoaded: true
      };
    default:
      return state;
  }
};
export default orderReducer;