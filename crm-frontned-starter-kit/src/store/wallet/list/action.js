import {
  FETCH_WALLET_START,
  FETCH_WALLET_SUCCESS,
  CLEAR_WALLETS,

  FETCH_CLIENT_WALLETS_REQUESTED,
  FETCH_CLIENT_WALLETS_SUCCESS,
  FETCH_CLIENT_WALLETS_FAIL,

  CHANGE_STATUS_WALLET_START,
  CHANGE_STATUS_WALLET_END,

  ADD_CLIENT_WALLET_REQUESTED,
  ADD_CLIENT_WALLET_SUCCESS,
  ADD_CLIENT_WALLET_FAIL,
  ADD_CLIENT_WALLET_CLEAR,
  CONVERT_WALLET_START,
  CONVERT_WALLET_ERROR,
  ERROR_CLEAR
} from "./actionTypes";

export const fetchWalletStart = (params) => {
  return {
    type: FETCH_WALLET_START,
    payload: params
  };
};

export const fetchWalletSuccess = (data) => {
  return {
    type: FETCH_WALLET_SUCCESS,
    payload: data
  };
};

export const clearWallets = () => {
  return {
    type: CLEAR_WALLETS
  };
};

// fetch client wallet details
export const fetchClientWallets = (params = {}) => {
  return {
    type: FETCH_CLIENT_WALLETS_REQUESTED,
    payload: params
  };
};

export const fetchClientWalletsSuccess = (data) => {
  return {
    type: FETCH_CLIENT_WALLETS_SUCCESS,
    payload: data
  };
};

export const fetchClientWalletsFail = (error) => {
  return {
    type: FETCH_CLIENT_WALLETS_FAIL,
    payload: { error }
  };
};

// add new wallet 
export const addWallet = (params = {}) => {
  return {
    type: ADD_CLIENT_WALLET_REQUESTED,
    payload: params
  };
};

export const addWalletSuccess = (data) => {
  return {
    type: ADD_CLIENT_WALLET_SUCCESS,
    payload: data
  };
};

export const addWalletFail = (error) => {
  return {
    type: ADD_CLIENT_WALLET_FAIL,
    payload: { error }
  };
};

export const addWalletClear = (data) => {
  return {
    type: ADD_CLIENT_WALLET_CLEAR,
    payload: data
  };
};

export const changeStatus = (id, status, index) => {
  return {
    type: CHANGE_STATUS_WALLET_START,
    payload: {
      id,
      status,
      index,
    },
  };
};

export const changeStatusDone = (params = {}) => {
  return {
    type: CHANGE_STATUS_WALLET_END,
    payload: params
  };
};

export const convertWalletStart = (values)=>{
  return {
    type: CONVERT_WALLET_START,
    payload: values
  };
};

export const convertWalletError = (error)=>{
  return {
    type: CONVERT_WALLET_ERROR,
    payload: error
  };
};

export const errorClear = ()=>{
  return {
    type: ERROR_CLEAR
  };
};