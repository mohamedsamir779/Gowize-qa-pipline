import {
  FETCH_CLIENT_BANK_ACCOUNT_REQUESTED,
  FETCH_CLIENT_BANK_ACCOUNT_SUCCESS,
  FETCH_CLIENT_BANK_ACCOUNT_FAIL,

  ADD_BANK_ACCOUNT_REQUESTED,
  ADD_BANK_ACCOUNT_SUCCESS,
  ADD_BANK_ACCOUNT_FAIL,
  ADD_BANK_ACCOUNT_CLEAR,
  
  DELETE_BANK_ACCOUNT_REQUESTED,
  DELETE_BANK_ACCOUNT_SUCCESS,
  DELETE_BANK_ACCOUNT_FAIL,
  
  EDIT_BANK_ACCOUNT_REQUESTED,
  EDIT_BANK_ACCOUNT_SUCCESS,
  EDIT_BANK_ACCOUNT_FAIL,
  EDIT_BANK_ACCOUNT_CLEAR
} from "./actionTypes";
  
const initalState = {
  error:"",
  loading:true,
  successMessage:"",
  editSuccess: false,
  deleteClearingCounter: 0,
  addClearingCounter: 0,
  bankAccountEditClearingCounter: 0
};
  
export const bankAccountReducer = (state = initalState, action)=>{
  switch (action.type){  
    // fetch client bank details
    case FETCH_CLIENT_BANK_ACCOUNT_REQUESTED:
      state = {
        ...state,
        loading: true
      };
      break;
    case FETCH_CLIENT_BANK_ACCOUNT_SUCCESS:
      state = { 
        ...state,
        success: true,
        error: false,
        loading: false,
        clientBankAccounts: [...action.payload.result.docs],
        totalDocs: action.payload.result.totalDocs,
        docs: action.payload.result.docs,
        hasNextPage: action.payload.result.hasNextPage,
        hasPrevPage: action.payload.result.hasPrevPage,
        limit: action.payload.result.limit,
        nextPage: action.payload.result.nextPage,
        page: action.payload.result.page,
        pagingCounter: action.payload.result.pagingCounter,
        prevPage: action.payload.result.prevPage,
        totalPages: action.payload.result.totalPages,
        addError: false
      };
      break;
    case FETCH_CLIENT_BANK_ACCOUNT_FAIL:
      state = {
        ...state,
        error: true,
        errorDetails: action.payload.error,
        loading: false
      };
      break;

    // add bank account
    case ADD_BANK_ACCOUNT_REQUESTED:
      state = {
        ...state,
        addLoading: true
      };
      break;
    case ADD_BANK_ACCOUNT_SUCCESS:
      state = {
        ...state,
        newBankAccount: action.payload.result,
        addSuccess: true,
        addError: false,
        addLoading: false
      };
      break;
    case ADD_BANK_ACCOUNT_FAIL:
      state = {
        ...state,
        addError: true,
        addSuccess: false,
        addErrorDetails: action.payload.error,
        addLoading: false
      };
      break;
    case ADD_BANK_ACCOUNT_CLEAR:
      state = {
        ...state,
        addClearingCounter: state.addClearingCounter + 1,
        addSuccess: false,
        addError: false
      };
      break;
      
      // delete bank account
    case DELETE_BANK_ACCOUNT_REQUESTED:
      state = {
        ...state,
        loading: true,
        deleteLoading: true
      };
      break;
    case DELETE_BANK_ACCOUNT_SUCCESS:
      state = {
        ...state,
        success: true,
        fail: false,
        loading: false,
        deleteLoading: false,
        deleteClearingCounter: state.deleteClearingCounter + 1
      };
      break;
    case DELETE_BANK_ACCOUNT_FAIL:
      state = {
        ...state,
        success: false,
        fail: true,
        loading:false,
        deleteFailDetails: action.payload.error
      };
      break;
  
      // edit bank account
    case EDIT_BANK_ACCOUNT_REQUESTED:
      state = {
        ...state,
        loading: true
      };
      break;
    case EDIT_BANK_ACCOUNT_SUCCESS:
      state = {
        ...state,
        loading: false,
        editResult: action.payload.result,
        editSuccess: true,
        editError: false
      };
      break;
    case EDIT_BANK_ACCOUNT_FAIL:
      state = {
        ...state,
        loading: false,
        editSuccess: false,
        editError: true,
        editErrorDetails: action.payload.error
      };
      break;
    case EDIT_BANK_ACCOUNT_CLEAR:
      state = {
        ...state,
        loading: false,
        bankAccountEditClearingCounter: state.bankAccountEditClearingCounter + 1,
        editError: false,
        editResult: null
      };
      break;
  
      
    default:
      state = { ...state };
  }
  return state;
};
export default bankAccountReducer;
