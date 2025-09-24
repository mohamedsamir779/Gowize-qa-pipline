
import {
  FETCH_REPORTS_START,
  FETCH_REPORTS_SUCCESS,
} from "./actionTypes";


const initialState = {
  loading: false,
  data: {},
  stats: 0,
  // totalDocs: 0,
  // docs: [],
  // page: 1
};
const reportsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_REPORTS_START:
      state = {
        ...state,
        loading: true,
      };
      break;
    case FETCH_REPORTS_SUCCESS:
      state = {
        ...state,
        loading: false,
        ...action.payload,
      };
      break;
    default:
      state = { ...state };

  }
  return state;
};
export default reportsReducer;