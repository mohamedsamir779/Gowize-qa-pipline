
import {
  FETCH_ACCOUNT_TYPES_START,
  FETCH_ACCOUNT_TYPES_END,
  FETCH_TRADING_ACCOUNTS_START,
  FETCH_TRADING_ACCOUNTS_END,
  FETCH_TRADING_ACCOUNT_START,
  FETCH_TRADING_ACCOUNT_END,
  CREATE_TRADING_ACCOUNT_START,
  CREATE_TRADING_ACCOUNT_END,
  CREATE_TRADING_ACCOUNT_CLEAR,

  FETCH_TRADING_ACCOUNT_BY_LOGIN_REQUESTED,
  FETCH_TRADING_ACCOUNT_BY_LOGIN_SUCCESS,
  FETCH_TRADING_ACCOUNT_BY_LOGIN_FAIL,
  
  FETCH_TRADING_ACCOUNTS_BY_CUSTOMERID_REQUESTED,
  FETCH_TRADING_ACCOUNTS_BY_CUSTOMERID_SUCCESS,
  FETCH_TRADING_ACCOUNTS_BY_CUSTOMERID_FAIL,
  UPDATE_LEVERAGE_START,
  UPDATE_PASSWORD_START,
  UPDATE_LEVERAGE_SUCCESS,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_LEVERAGE_FAIL,
  UPDATE_PASSWORD_FAIL,
  LINK_TRADING_ACCOUNT_START,
  UPDATE_TYPE_START,
  UPDATE_TYPE_SUCCESS,
  UPDATE_TYPE_FAIL,
  CHANGE_ACCESS_START,
  CHANGE_ACCESS_FAIL,
  CHANGE_ACCESS_SUCCESS,
  GET_OPEN_POSITIONS_START,
  GET_CLOSE_POSITIONS_START,
  GET_OPEN_POSITIONS_SUCCESS,
  GET_CLOSE_POSITIONS_SUCCESS,
  ADD_ACCOUNT_TYPE_START,
  ADD_ACCOUNT_TYPE_SUCCESS,
  ADD_ACCOUNT_TYPE_FAIL,
  UPDATE_ACCOUNT_TYPE_START,
  UPDATE_ACCOUNT_TYPE_SUCCESS,
  UPDATE_ACCOUNT_TYPE_FAIL,
} from "./actionTypes";

const initialState = {
  tradingAccounts:[],
  loading:false,
  fetchAllTradingAccountsLoading: false,
  fetchTradingAccountsByCustomerIdLoading: false,
  submitting: false,
  updating: false,
  error: null,
  modalClear:false,
  accountTypesLoading: false,
  createCounter : 0,
  accounts: {},
  positions: {
    open: null,
    closed: null,
    loading: false,
  },
};

const tradingAccountReducer = (state = initialState, action)=>{
  switch (action.type){
    case FETCH_ACCOUNT_TYPES_START:
      state = {
        ...state,
        accountTypesLoading: true,
      };
      break;
    case FETCH_ACCOUNT_TYPES_END:
      state = {
        ...state,
        accountTypesLoading: false,
        accountTypes: action.payload.data,
        accountTypesError: action.payload.error,
      };
      break;
    case ADD_ACCOUNT_TYPE_START:
      state = {
        ...state,
        submitting: true,
      };
      break;
    case ADD_ACCOUNT_TYPE_SUCCESS:
      state = {
        ...state,
        submitting: false,
        error: null,
        accountTypes: [...state.accountTypes, action.payload.data],
      };
      break;
    case ADD_ACCOUNT_TYPE_FAIL:
      state = {
        ...state,
        submitting: false,
        error: action.payload.error,
      };
      break;
    case UPDATE_ACCOUNT_TYPE_START:
      state = {
        ...state,
        updating: true,
      };
      break;
    case UPDATE_ACCOUNT_TYPE_SUCCESS:
      state = {
        ...state,
        updating: false,
        error: null,
      };
      break;
    case UPDATE_ACCOUNT_TYPE_FAIL:
      state = {
        ...state,
        updating: false,
        error: action.payload.error,
      };
      break;

    // fetch all trading accounts 
    case FETCH_TRADING_ACCOUNTS_START:
      state = {
        ...state,
        fetchAllTradingAccountsLoading: true,
      };
      break;
    case FETCH_TRADING_ACCOUNTS_END:
      state = {
        ...state,
        fetchAllTradingAccountsLoading: false,
        accounts: action.payload,
        accountsError: action.payload.error,
        createCounter: state.createCounter + 1,
      };
      break;
    
    case FETCH_TRADING_ACCOUNT_START:
      state = {
        ...state,
        loading: true,
      };
      break;
    case FETCH_TRADING_ACCOUNT_END:
      state = {
        ...state,
        loading: false,
        accounts: action.payload.data,
        accountsError: action.payload.error,
        createCounter: state.createCounter + 1,
      };
      break;
    
    case CREATE_TRADING_ACCOUNT_START:
    case LINK_TRADING_ACCOUNT_START:
      state = {
        ...state,
        creating: true,
      };
      break;
    case CREATE_TRADING_ACCOUNT_END:
      if (action.payload.data) {
        state = {
          ...state,
          creating: false,
          accounts: {
            ...state.accounts,
            docs : [
              action.payload.data,
              ...(state.accounts && state.accounts.docs || [])
            ]
          },
        };
      }
      state = {
        ...state,
        creating: false,
      };
      break;
    case CREATE_TRADING_ACCOUNT_CLEAR:
      state = {
        ...state,
        createCounter: state.createCounter + 1,
      };
      break;

    // fetch trading accounts by customer Id
    case FETCH_TRADING_ACCOUNTS_BY_CUSTOMERID_REQUESTED:
      state = {
        ...state,
        fetchTradingAccountsByCustomerIdLoading: true
      };
      break;
    case FETCH_TRADING_ACCOUNTS_BY_CUSTOMERID_SUCCESS:
      state = {
        ...state,
        fetchTradingAccountsByCustomerIdLoading: false,
        customerTradingAccounts: action.payload.result.docs,
        fetchTradingAccountsByCustomerIdSuccess: true, 
        fetchTradingAccountsByCustomerIdFail: false, 
      };
      break;
    case FETCH_TRADING_ACCOUNTS_BY_CUSTOMERID_FAIL:
      state = {
        ...state,
        fetchTradingAccountsByCustomerIdLoading: false,
        fetchTradingAccountsByCustomerIdSuccess: false, 
        fetchTradingAccountsByCustomerIdFail: true,  
        fetchTradingAccountsByCustomerIdFailDetails: action.payload.error, 
      };
      break;

    // fetch trading accounts by login
    case FETCH_TRADING_ACCOUNT_BY_LOGIN_REQUESTED:
      state = {
        ...state,
        fetchTradingAccountsByLoginLoading: true
      };
      break;
    case FETCH_TRADING_ACCOUNT_BY_LOGIN_SUCCESS:
      state = {
        ...state,
        fetchTradingAccountsByLoginLoading: false,
        loginTradingAccounts: action.payload.result.docs,
        fetchTradingAccountsByLoginSuccess: true, 
        fetchTradingAccountsByLoginFail: false, 
      };
      break;
    case FETCH_TRADING_ACCOUNT_BY_LOGIN_FAIL:
      state = {
        ...state,
        fetchTradingAccountsByLoginLoading: false,
        fetchTradingAccountsByLoginSuccess: false, 
        fetchTradingAccountsByLoginFail: true,  
        fetchTradingAccountsByLoginFailDetails: action.payload.error, 
      };
      break;
    case UPDATE_LEVERAGE_START:
    case UPDATE_PASSWORD_START:
    case UPDATE_TYPE_START:
    case CHANGE_ACCESS_START:
      return {
        ...state,
        error: null,
        submitting: true,
      };
    case UPDATE_LEVERAGE_SUCCESS:
    case UPDATE_PASSWORD_SUCCESS:
    case UPDATE_TYPE_SUCCESS:
    case CHANGE_ACCESS_SUCCESS:
      return {
        ...state,
        error: null,
        submitting: false,
      };
    case UPDATE_LEVERAGE_FAIL:
    case UPDATE_PASSWORD_FAIL:
    case UPDATE_TYPE_FAIL:
    case CHANGE_ACCESS_FAIL:
      return {
        ...state,
        error: action.payload,
        submitting: false,
      };
    case GET_OPEN_POSITIONS_START:
    case GET_CLOSE_POSITIONS_START:
      return {
        ...state,
        error: "",
        positions: {
          loading: true,
        }
      };
    case GET_OPEN_POSITIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        positions: {
          open: action.payload,
          closed: state.positions.closed,
          loading: false,
        }
      };
    case GET_CLOSE_POSITIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        positions: {
          open: state.positions.open,
          closed: action.payload,
          loading: false,
        }
      };
    
    default:
      state = { ...state };
  }
  return state;
};
export default tradingAccountReducer;
