import {
  FETCH_COMPANY_BANK_ACCOUNT_REQUESTED,
  FETCH_COMPANY_BANK_ACCOUNT_SUCCESS,
  FETCH_COMPANY_BANK_ACCOUNT_FAIL,

  ADD_COMPANY_BANK_ACCOUNT_REQUESTED,
  ADD_COMPANY_BANK_ACCOUNT_SUCCESS,
  ADD_COMPANY_BANK_ACCOUNT_FAIL,
  ADD_COMPANY_BANK_ACCOUNT_CLEAR,
  
  DELETE_COMPANY_BANK_ACCOUNT_REQUESTED,
  DELETE_COMPANY_BANK_ACCOUNT_SUCCESS,
  DELETE_COMPANY_BANK_ACCOUNT_FAIL,
  
  EDIT_COMPANY_BANK_ACCOUNT_REQUESTED,
  EDIT_COMPANY_BANK_ACCOUNT_SUCCESS,
  EDIT_COMPANY_BANK_ACCOUNT_FAIL,
  EDIT_COMPANY_BANK_ACCOUNT_CLEAR
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
  
export const companyBankAccountReducer = (state = initalState, action)=>{
  switch (action.type){  
    // fetch client bank details
    case FETCH_COMPANY_BANK_ACCOUNT_REQUESTED:
      state = {
        ...state,
        loading: true
      };
      break;
    case FETCH_COMPANY_BANK_ACCOUNT_SUCCESS:
      state = { 
        ...state,
        ...action.payload.result,
        success: true,
        error: false,
        loading: false,
        addError: false
      };
      break;
    case FETCH_COMPANY_BANK_ACCOUNT_FAIL:
      state = {
        ...state,
        error: true,
        errorDetails: action.payload.error,
        loading: false
      };
      break;

    case ADD_COMPANY_BANK_ACCOUNT_REQUESTED:
      state = {
        ...state,
        addLoading: true
      };
      break;
    case ADD_COMPANY_BANK_ACCOUNT_SUCCESS:
      state = {
        ...state,
        newBankAccount: action.payload.result,
        addSuccess: true,
        addError: false,
        addLoading: false
      };
      break;
    case ADD_COMPANY_BANK_ACCOUNT_FAIL:
      state = {
        ...state,
        addError: true,
        addSuccess: false,
        addErrorDetails: action.payload.error,
        addLoading: false
      };
      break;
    case ADD_COMPANY_BANK_ACCOUNT_CLEAR:
      state = {
        ...state,
        addClearingCounter: state.addClearingCounter + 1,
        addSuccess: false,
        addError: false
      };
      break;
      
      // delete bank account
    case DELETE_COMPANY_BANK_ACCOUNT_REQUESTED:
      state = {
        ...state,
        loading: true,
        deleteLoading: true
      };
      break;
    case DELETE_COMPANY_BANK_ACCOUNT_SUCCESS:
      state = {
        ...state,
        success: true,
        fail: false,
        loading: false,
        deleteLoading: false,
        deleteClearingCounter: state.deleteClearingCounter + 1
      };
      break;
    case DELETE_COMPANY_BANK_ACCOUNT_FAIL:
      state = {
        ...state,
        success: false,
        fail: true,
        loading:false,
        deleteFailDetails: action.payload.error
      };
      break;
  
      // edit bank account
    case EDIT_COMPANY_BANK_ACCOUNT_REQUESTED:
      state = {
        ...state,
        loading: true
      };
      break;
    case EDIT_COMPANY_BANK_ACCOUNT_SUCCESS:
      state = {
        ...state,
        loading: false,
        editResult: action.payload.result,
        editSuccess: true,
        editError: false
      };
      break;
    case EDIT_COMPANY_BANK_ACCOUNT_FAIL:
      state = {
        ...state,
        loading: false,
        editSuccess: false,
        editError: true,
        editErrorDetails: action.payload.error
      };
      break;
    case EDIT_COMPANY_BANK_ACCOUNT_CLEAR:
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
export default companyBankAccountReducer;
