import {
  FETCH_ORDERS_PROFITS_START,
  FETCH_ORDERS_PROFITS_SUCCESS,
  FETCH_ORDERS_PROFITS_FAIL, 
} from "./actionTypes";
  
const initialState = {
  error: "",
  loading: false,
};
  
const ordersReducer = (state = initialState, action) => {
  switch (action.type){
    // FETCH
    case FETCH_ORDERS_PROFITS_START:
      state = {
        ...state,
        loading: true
      };
      break;
    case FETCH_ORDERS_PROFITS_SUCCESS:
      state = {
        ...state,
        loading: false,
        docs: [...action.payload.docs],
        totalDocs: action.payload.totalDocs,
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
        limit: action.payload.limit,
        nextPage: action.payload.nextPage,
        page: action.payload.page,
        pagingCounter: action.payload.pagingCounter,
        prevPage: action.payload.prevPage,
        totalPages: action.payload.totalPages,
        OrderRes: null,
        addError: false
      };
      break;
    case FETCH_ORDERS_PROFITS_FAIL:
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
  
export default ordersReducer;