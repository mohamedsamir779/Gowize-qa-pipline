import {
  GET_LOGS_START,
  GET_LOGS_END,
  GET_USER_LOGS,
  GET_USER_LOGS_END,
} from "./actionTypes";

const INIT_STATE = {
  loading: false,
  logs: {},
  clearingCounter: 0,
};

const Calendar = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_LOGS_START:
    case GET_USER_LOGS:
      return {
        ...state,
        loading: true,
        logs: {},
      };
    case GET_LOGS_END:
    case GET_USER_LOGS_END:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        logs: action.payload.data
      };
    default:
      return state;
  }
};

export default Calendar;
