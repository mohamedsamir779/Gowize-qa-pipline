import {
  FETCH_BANK_ACCOUNTS_FAILED,
  FETCH_BANK_ACCOUNTS_START,
  FETCH_BANK_ACCOUNTS_SUCCESS
} from "./actionTypes";

const initialState = {
  loading: false,
  bankAccounts: [],
};

const bankAccounts = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_BANK_ACCOUNTS_START:
      state = { 
        ...state,
        loading: true 
      };
      break;
    case FETCH_BANK_ACCOUNTS_FAILED:
      state = { 
        ...state, 
        loading: false, 
        error: action.payload 
      };
      break;

    case FETCH_BANK_ACCOUNTS_SUCCESS:
      state = {
        ...state,
        loading: false,
        error: "",
        bankAccounts: action.payload,
      };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default bankAccounts;
