import {
  FETCH_WALLET_REPORT_FAILED,
  FETCH_WALLET_REPORT_START,
  FETCH_WALLET_REPORT_SUCCESS,
  FETCH_WALLETS_FAILED, FETCH_WALLETS_START, FETCH_WALLETS_SUCCESS, IB_WALLET_TRANSFER_FAILED, IB_WALLET_TRANSFER_START, IB_WALLET_TRANSFER_SUCCESS, REQUEST_WALLET_FX_TRANSFER_ERROR, REQUEST_WALLET_FX_TRANSFER_START, REQUEST_WALLET_FX_TRANSFER_SUCCESS 
} from "./actionTypes";

export const fetchWallets = (params = {}) => {
  return {
    type: FETCH_WALLETS_START,
    payload: params
  };
};
export const fetchWalletsFailed = (error) => {
  return {
    type: FETCH_WALLETS_FAILED,
    payload: error
  };
};
export const fetchWalletsSuccess = (params) => {
  return {
    type: FETCH_WALLETS_SUCCESS,
    payload: params
  };
};

export const createWalletTransfer = (data) => {
  return {
    type: REQUEST_WALLET_FX_TRANSFER_START,
    payload: data,
  };
};

export const createWalletTransferSuccess = (data) => {
  return {
    type: REQUEST_WALLET_FX_TRANSFER_SUCCESS,
    payload: data,
  };
};

export const createWalletTransferError = (error) => {
  return {
    type: REQUEST_WALLET_FX_TRANSFER_ERROR,
    payload: error,
  };
};

export const fetchReport = (params = {}) => {
  return {
    type: FETCH_WALLET_REPORT_START,
    payload: params
  };
};

export const fetchReportSuccess = (params) => {
  return {
    type: FETCH_WALLET_REPORT_SUCCESS,
    payload: params
  };
};

export const fetchReportFailed = (error) => {
  return {
    type: FETCH_WALLET_REPORT_FAILED,
    payload: error
  };
};

export const createIbWalletTransfer = (data) => {
  return {
    type: IB_WALLET_TRANSFER_START,
    payload: data,
  };
};

export const createIbWalletTransferSuccess = (data) => {
  return {
    type: IB_WALLET_TRANSFER_SUCCESS,
    payload: data,
  };
};

export const createIbWalletTransferError = (error) => {
  return {
    type: IB_WALLET_TRANSFER_FAILED,
    payload: error,
  };
};