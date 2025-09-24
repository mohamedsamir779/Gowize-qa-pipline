import {
  FETCH_ORDERS_REQUESTED,
  FETCH_ORDERS_SUCCESS,
  FETCH_ORDERS_FAIL, 
  
  ADD_ORDER_REQUESTED,
  ADD_ORDER_SUCCESS,
  ADD_ORDER_FAIL,
  ADD_ORDER_CLEAR,

  DELETE_ORDER_REQUESTED,
  DELETE_ORDER_SUCCESS,
  DELETE_ORDER_FAIL 
} from "./actionTypes";

const initialState = {
  error: "",
  loading: false,
  orders: [],
  clearingCounter: 0,
  deleteClearingCounter: 0,
  editClearingCounter: 0,
  editContentClearingCounter: 0,
  activeComponentProp: "list component",
  isBackButtonActive: true
};

const ordersReducer = (state = initialState, action) => {
  switch (action.type){
    // FETCH
    case FETCH_ORDERS_REQUESTED:
      state = {
        ...state,
        loading: true
      };
      break;
    case FETCH_ORDERS_SUCCESS:
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
    case FETCH_ORDERS_FAIL:
      state = {
        ...state,
        loading: false,
        error: action.payload.error.message
      };
      break;
 
    // ADD
    case ADD_ORDER_REQUESTED:
      state = {
        ...state,
        addLoading: true,
        OrderRes: null
      };
      break;
    case ADD_ORDER_SUCCESS:
      state = {
        ...state,
        addResult: action.payload,
        docs: [ action.payload, ...state.docs ],
        addSuccess: true,
        addError: false,
        addLoading: false,
        OrderRes: action.payload
      };
      break;
    case ADD_ORDER_FAIL:
      state = {
        ...state,
        addErrorDetails: action.payload.error.message,
        addLoading: false,
        addSuccess: false,
        addError: true
      };
      break;
    case ADD_ORDER_CLEAR:
      state = {
        ...state,
        addErrorDetails: "",
        addSuccess: false,
        addError: false,
        addResult: null,
        clearingCounter: state.clearingCounter + 1,
        activeComponent: "edit component",
        isBackButtonActive: false
      };
      break;

    // DELETE
    case DELETE_ORDER_REQUESTED:
      state = {
        ...state,
        deleteLoading: true
      };
      break;
    case DELETE_ORDER_SUCCESS:
      state = {
        ...state,
        docs: state.docs.filter(obj => obj._id !== action.payload.id),
        deleteLoading: false,
        deleteResult: action.payload.result,
        deleteError: action.payload.error,
        deleteClearingCounter: state.deleteClearingCounter + 1
      };
      break;
    case DELETE_ORDER_FAIL:
      state = {
        ...state,
        deleteLoading: false,
        deleteClearingCounter: state.deleteClearingCounter + 1,
        deleteError: action.payload.error
      };
      break;

 
    default: 
      state = { ...state };
  }

  return state;
};

export default ordersReducer;