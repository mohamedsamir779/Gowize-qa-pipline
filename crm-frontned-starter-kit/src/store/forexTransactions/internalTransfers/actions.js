import {
  FETCH_INTERNAL_TRANSFERS_REQUESTED,
  FETCH_INTERNAL_TRANSFERS_SUCCESS,
  FETCH_INTERNAL_TRANSFERS_FAIL,

  ADD_INTERNAL_TRANSFER_REQUESTED,
  ADD_INTERNAL_TRANSFER_SUCCESS,
  ADD_INTERNAL_TRANSFER_FAIL,
  ADD_INTERNAL_TRANSFER_CLEAR,
  ADD_INTERNAL_TRANSFER_ERROR_CLEAR,
  APPROVE_INTERNAL_TRANSFER,
  REJECT_INTERNAL_TRANSFER
} from "./actionTypes";


// fetch internal transfers
export const fetchInternalTransfers = (params = {}) => {
  return {
    type: FETCH_INTERNAL_TRANSFERS_REQUESTED,
    payload: params
  };
};
export const fetchInternalTransfersSuccess = (data) => {
  return {
    type: FETCH_INTERNAL_TRANSFERS_SUCCESS,
    payload: data
  };
};
export const fetchInternalTransfersFail = (error) => {
  return {
    type: FETCH_INTERNAL_TRANSFERS_FAIL,
    payload: { error }
  };
};

// add internal transfer
export const addInternalTransfer = (params = {}) => {
  return {
    type: ADD_INTERNAL_TRANSFER_REQUESTED,
    payload: params
  };
};
export const addInternalTransferSuccess = (data) => {
  return {
    type: ADD_INTERNAL_TRANSFER_SUCCESS,
    payload: data
  };
};
export const addInternalTransferFail = (error) => {
  return {
    type: ADD_INTERNAL_TRANSFER_FAIL,
    payload: { error }
  };
};
export const addInternalTransferClear = (data) => {
  return {
    type: ADD_INTERNAL_TRANSFER_CLEAR,
    payload: data
  };
};
export const addInternalTransferErrorClear = () => {
  return {
    type: ADD_INTERNAL_TRANSFER_ERROR_CLEAR
  };
};

export const approveInternalTransfer = (payload) =>{
  return {
    type: APPROVE_INTERNAL_TRANSFER,
    payload: payload
  };
};

export const rejectInternalTransfer = (payload) =>{
  return {
    type: REJECT_INTERNAL_TRANSFER,
    payload: payload
  };
};