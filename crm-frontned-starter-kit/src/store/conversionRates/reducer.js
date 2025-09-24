import {
  ADD_CONVERSION_RATES_ERROR,
  ADD_CONVERSION_RATES_START,
  ADD_CONVERSION_RATES_SUCCESS,
  EDIT_CONVERSION_RATES_ERROR,
  EDIT_CONVERSION_RATES_START,
  EDIT_CONVERSION_RATES_SUCCESS,
  FETCH_CONVERSION_RATES_ERROR,
  FETCH_CONVERSION_RATES_START,
  FETCH_CONVERSION_RATES_SUCCESS
} from "./actionTypes";

const initialState = {
  loading: false,
  submit: false,
  error: "",
  conversionRates: [],
  clearingCounter: 0,
  pagination: {},
};
const conversionRatesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CONVERSION_RATES_START:
      state = {
        ...state,
        loading: true,
        error: "",
      };
      break;
    case FETCH_CONVERSION_RATES_SUCCESS:
      state = {
        ...state,
        loading: false,
        conversionRates: action.payload.docs,
        pagination: {
          ...action.payload,
          docs: undefined,
        },
      };
      break;
    case FETCH_CONVERSION_RATES_ERROR:
      state = {
        ...state,
        loading: false,
        error: action.payload.error,
      };
      break;
    case ADD_CONVERSION_RATES_START:
      state = {
        ...state,
        submit: true,
        error: "",
      };
      break;
    case ADD_CONVERSION_RATES_SUCCESS:
      state = {
        ...state,
        submit: false,
        clearingCounter: state.clearingCounter + 1,
      };
      break;
    case ADD_CONVERSION_RATES_ERROR:
      state = {
        ...state,
        submit: false,
        error: action.payload.error,
      };
      break;
    case EDIT_CONVERSION_RATES_START:
      state = {
        ...state,
        submit: true,
        error: "",
      };
      break;
    case EDIT_CONVERSION_RATES_SUCCESS:
      state = {
        ...state,
        submit: false,
        clearingCounter: state.clearingCounter + 1,
      };
      break;
    case EDIT_CONVERSION_RATES_ERROR:
      state = {
        ...state,
        submit: false,
        error: action.payload.error,
      };
      break;
    default:
      state = { ...state };

  }
  return state;
};
export default conversionRatesReducer;