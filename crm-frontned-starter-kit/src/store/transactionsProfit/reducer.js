import {
  FETCH_TRANSACTIONS_PROFITS_START,
  FETCH_TRANSACTIONS_PROFITS_SUCCESS,
  FETCH_TRANSACTIONS_PROFITS_FAIL, 
} from "./actionTypes";
  
const initialState = {
  loading: false,
  docs: [],
};
  
const transactionsProfitsReducer = (state = initialState, action) => {
  switch (action.type){
    // FETCH
    case FETCH_TRANSACTIONS_PROFITS_START:
      state = {
        ...state,
        loading: true
      };
      break;
    case FETCH_TRANSACTIONS_PROFITS_SUCCESS:
      state = {
        ...state,
        loading: false,
        docs: [...action.payload],
      };
      break;
    case FETCH_TRANSACTIONS_PROFITS_FAIL:
      state = {
        ...state,
        loading: false,
        error: action.payload.error.message
      };
      break;
   
    default: 
      state = { ...state };
  }
  
  return state;
};
  
export default transactionsProfitsReducer;