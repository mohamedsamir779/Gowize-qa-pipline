import {
  FETCH_TRADING_ACCOUNTS_REQUESTED,
  FETCH_TRADING_ACCOUNTS_START,
  FETCH_TRADING_ACCOUNTS_END,
  FETCH_ACCOUNT_TYPES_START,
  FETCH_ACCOUNT_TYPES_END,
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
  UPDATE_LEVERAGE_SUCCESS,
  UPDATE_LEVERAGE_FAIL,
  UPDATE_PASSWORD_START,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_FAIL,
  LINK_TRADING_ACCOUNT_START,
  UPDATE_TYPE_START,
  UPDATE_TYPE_SUCCESS,
  UPDATE_TYPE_FAIL,
  CHANGE_ACCESS_START,
  CHANGE_ACCESS_SUCCESS,
  CHANGE_ACCESS_FAIL,
  GET_OPEN_POSITIONS_START,
  GET_OPEN_POSITIONS_SUCCESS,
  GET_CLOSE_POSITIONS_SUCCESS,
  GET_CLOSE_POSITIONS_START,
  ADD_ACCOUNT_TYPE_START,
  ADD_ACCOUNT_TYPE_SUCCESS,
  ADD_ACCOUNT_TYPE_FAIL,
  UPDATE_ACCOUNT_TYPE_START,
  UPDATE_ACCOUNT_TYPE_FAIL,
  UPDATE_ACCOUNT_TYPE_SUCCESS
} from "./actionTypes";

export const fetchAccountTypes = (params = {})=>{
  return {
    type:FETCH_ACCOUNT_TYPES_START,
    payload: params
  };
};
export const fetchAccountTypesEnd = (data)=>{
  return {
    type:FETCH_ACCOUNT_TYPES_END,
    payload: data
  };
};

export const addAccountType = (params = {}) => {
  return {
    type: ADD_ACCOUNT_TYPE_START,
    payload: params
  };
};
export const addAccountTypeSuccess = (data) => {
  return {
    type: ADD_ACCOUNT_TYPE_SUCCESS,
    payload: data
  };
};
export const addAccountTypeFail = (data) => {
  return {
    type: ADD_ACCOUNT_TYPE_FAIL,
    payload: data
  };
};
export const updateAccountType = (id, params = {}) => {
  return {
    type: UPDATE_ACCOUNT_TYPE_START,
    payload: {
      id,
      ...params
    }
  };
};
export const updateAccountTypeSuccess = (data) => {
  return {
    type: UPDATE_ACCOUNT_TYPE_SUCCESS,
    payload: data
  };
};
export const updateAccountTypeFail = (data) => {
  return {
    type: UPDATE_ACCOUNT_TYPE_FAIL,
    payload: data
  };
};

// fetch trading account by login
export const fetchTradingAccountsByLogin = (params = {}) => {
  return {
    type: FETCH_TRADING_ACCOUNTS_REQUESTED,
    payload: params
  };
};

export const fetchTradingAccounts = (params = {})=>{
  return {
    type:FETCH_TRADING_ACCOUNTS_START,
    payload: params
  };
};

export const fetchTradingAccountsEnd = (data) => {
  return {
    type: FETCH_TRADING_ACCOUNTS_END,
    payload: data
  };
};

// export const fetchTradingAccountsFail = (error) => {
//   return {
//     type: FETCH_TRADING_ACCOUNTS_FAIL,
//     payload: { error }
//   };
// };

export const fetchTradingAccountEnd = (data)=>{
  return {
    type:FETCH_TRADING_ACCOUNT_END,
    payload: data
  };
};

export const linkTradingAccount = (params = {})=>{
  return {
    type: LINK_TRADING_ACCOUNT_START,
    payload: params
  };
};

export const createTradingAccount = (params = {})=>{
  return {
    type:CREATE_TRADING_ACCOUNT_START,
    payload: params
  };
};

export const createTradingAccountEnd = (data)=>{
  return {
    type:CREATE_TRADING_ACCOUNT_END,
    payload: data
  };
};

export const createAccountClear = (data)=>{
  return {
    type:CREATE_TRADING_ACCOUNT_CLEAR,
    payload: data
  };
};

// fetch trading accounts by login
export const fetchTradingAccountByLogin = (params = {}) => {
  return {
    type: FETCH_TRADING_ACCOUNT_BY_LOGIN_REQUESTED,
    payload: params
  };
};
export const fetchTradingAccountByLoginSuccess = (data) => {
  return {
    type: FETCH_TRADING_ACCOUNT_BY_LOGIN_SUCCESS,
    payload: data
  };
};
export const fetchTradingAccountByLoginFail = (error) => {
  return {
    type: FETCH_TRADING_ACCOUNT_BY_LOGIN_FAIL,
    payload: { error }
  };
};

// fetch trading accounts by customer Id
export const fetchTradingAccountByCustomerId = (params = {}) => {
  return {
    type: FETCH_TRADING_ACCOUNTS_BY_CUSTOMERID_REQUESTED,
    payload: params
  };
};
export const fetchTradingAccountByCustomerIdSuccess = (data) => {
  return {
    type: FETCH_TRADING_ACCOUNTS_BY_CUSTOMERID_SUCCESS,
    payload: data
  };
};
export const fetchTradingAccountByCustomerIdFail = (error) => {
  return {
    type: FETCH_TRADING_ACCOUNTS_BY_CUSTOMERID_FAIL,
    payload: { error }
  };
};

export const updateLeverage = (payload) => {
  return {
    type: UPDATE_LEVERAGE_START,
    payload,
  };
};
export const updateLeverageSuccess = (params = {}) => {
  return {
    type: UPDATE_LEVERAGE_SUCCESS,
    payload: params
  };
};
export const updateLeverageFail = (params = {}) => {
  return {
    type: UPDATE_LEVERAGE_FAIL,
    payload: params
  };
};

export const updatePassword = (payload) => {
  return {
    type: UPDATE_PASSWORD_START,
    payload,
  };
};
export const updatePasswordSuccess = (params = {}) => {
  return {
    type: UPDATE_PASSWORD_SUCCESS,
    payload: params
  };
};
export const updatePasswordFail = (params = {}) => {
  return {
    type: UPDATE_PASSWORD_FAIL,
    payload: params
  };
};

export const updateType = (payload) => {
  return {
    type: UPDATE_TYPE_START,
    payload,
  };
};
export const updateTypeSuccess = (params = {}) => {
  return {
    type: UPDATE_TYPE_SUCCESS,
    payload: params
  };
};
export const updateTypeFail = (params = {}) => {
  return {
    type: UPDATE_TYPE_FAIL,
    payload: params
  };
};

export const changeAccess = (payload) => {
  return {
    type: CHANGE_ACCESS_START,
    payload,
  };
};
export const changeAccessSuccess = (params = {}) => {
  return {
    type: CHANGE_ACCESS_SUCCESS,
    payload: params
  };
};
export const changeAccessFail = (params = {}) => {
  return {
    type: CHANGE_ACCESS_FAIL,
    payload: params
  };
};

export const getOpenPositionsStart = (params) => {
  return {
    type: GET_OPEN_POSITIONS_START,
    payload: params
  };
};
export const getOpenPositionsSuccess = (data) => {
  return {
    type: GET_OPEN_POSITIONS_SUCCESS,
    payload: data
  };
};

export const getClosePositionsStart = (params) => {
  return {
    type: GET_CLOSE_POSITIONS_START,
    payload: params
  };
};
export const getClosePositionsSuccess = (data) => {
  return {
    type: GET_CLOSE_POSITIONS_SUCCESS,
    payload: data
  };
};
