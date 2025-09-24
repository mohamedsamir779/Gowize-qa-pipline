import { FETCH_CONVERSION_RATES_START, FETCH_CONVERSION_RATES_SUCCESS } from "./actionTypes";

const initialState = {
  loading: false,
  conversionRate : null,
  error: "",
};

const conversionReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CONVERSION_RATES_START:
      return {
        ...state,
        loading: true,
      };
    case FETCH_CONVERSION_RATES_SUCCESS:
      if (action.payload.success) {
        return {
          ...state,
          loading: false,
          conversionRate: action.payload.result,
        };
      }
      return {
        ...state,
        loading: false,
        error: action.payload.message,
      };
    default:
      return { ...state };
  }
};
export default conversionReducer;