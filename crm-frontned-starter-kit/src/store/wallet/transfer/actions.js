import {
  APPROVE_WALLET_TRANSFER_ERROR,
  APPROVE_WALLET_TRANSFER_START,
  APPROVE_WALLET_TRANSFER_SUCCESS,
  FETCH_WALLET_TRANSFER_ERROR,
  FETCH_WALLET_TRANSFER_START,
  FETCH_WALLET_TRANSFER_SUCCESS,
  REJECT_WALLET_TRANSFER_ERROR,
  REJECT_WALLET_TRANSFER_START,
  REJECT_WALLET_TRANSFER_SUCCESS
} from "./actionTypes";

export const fetchWalletTransfer = (data) => {
  return {
    type: FETCH_WALLET_TRANSFER_START,
    payload: data,
  };
};

export const fetchWalletTransferSuccess = (data) => {
  return {
    type: FETCH_WALLET_TRANSFER_SUCCESS,
    payload: data,
  };
};

export const fetchWalletTransferError = (error) => {
  return {
    type: FETCH_WALLET_TRANSFER_ERROR,
    payload: error,
  };
};

export const approveWalletTransfer = (data) => {
  return {
    type: APPROVE_WALLET_TRANSFER_START,
    payload: data,
  };
};

export const approveWalletTransferSuccess = (data) => {
  return {
    type: APPROVE_WALLET_TRANSFER_SUCCESS,
    payload: data,
  };
};

export const approveWalletTransferError = (error) => {
  return {
    type: APPROVE_WALLET_TRANSFER_ERROR,
    payload: error,
  };
};

export const rejectWalletTransfer = (data) => {
  return {
    type: REJECT_WALLET_TRANSFER_START,
    payload: data,
  };
};

export const rejectWalletTransferSuccess = (data) => {
  return {
    type: REJECT_WALLET_TRANSFER_SUCCESS,
    payload: data,
  };
};

export const rejectWalletTransferError = (error) => {
  return {
    type: REJECT_WALLET_TRANSFER_ERROR,
    payload: error,
  };
};