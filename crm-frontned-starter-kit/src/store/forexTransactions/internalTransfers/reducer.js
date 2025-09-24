import { APPROVE_FOREX_DEPOSIT_SUCCESS } from "../deposits/actionTypes";
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
  APPROVE_INTERNAL_TRANSFER_SUCCESS,
  REJECT_INTERNAL_TRANSFER,
  REJECT_INTERNAL_TRANSFER_SUCCESS
} from "./actionTypes";

const initalState = {
  internalTransfers: [],
  fetchInternalTransfersLoading: false,
  addInternalTransferLoading: false,
  error: "",
  modalClear: false,
  internalTransferResponseMessage: "",
  addInternalTransferClearingCounter: 0
};

const internalTransferReducer = (state = initalState, action) => {
  switch (action.type){
    // fetch internal transfers
    case FETCH_INTERNAL_TRANSFERS_REQUESTED:
      state = {
        ...state,
        fetchInternalTransfersLoading: true
      };
      break;
    case FETCH_INTERNAL_TRANSFERS_SUCCESS:
      state = {
        ...state,
        internalTransfers: [...action.payload.result.docs],
        internalTransfersTotalDocs: action.payload.result.totalDocs,
        hasNextPage: action.payload.result.hasNextPage,
        hasPrevPage: action.payload.result.hasPrevPage,
        limit: action.payload.result.limit,
        nextPage: action.payload.result.nextPage,
        page: action.payload.result.page,
        pagingCounter: action.payload.result.pagingCounter,
        prevPage: action.payload.result.prevPage,
        totalPages: action.payload.result.totalPages,
        fetchInternalTransfersLoading: false,  
        totalDocs: action.payload.result.totalDocs
      };
      break;
    case FETCH_INTERNAL_TRANSFERS_FAIL:
      state = {
        ...state,
        fetchInternalTransfersLoading: false,
        internalTransferError: action.payload
      };
      break;

    // add internal transfer
    case ADD_INTERNAL_TRANSFER_REQUESTED:
      state = {
        ...state,
        addInternalTransferLoading: true
      };
      break;
    case ADD_INTERNAL_TRANSFER_SUCCESS:
      state = {
        ...state,
        newInternalTransfer: action.payload.result,
        addInternalTransferSuccess: true,
        addInternalTransferFail: false
      };
      break;
    case ADD_INTERNAL_TRANSFER_FAIL:
      state = {
        ...state,
        addInternalTransferSuccess: false,
        addInternalTransferFail: true,
        addInternalTransferLoading: false,
        addInternalTransferFailDetails: action.payload.error
      };
      break;
    case ADD_INTERNAL_TRANSFER_CLEAR:
      state = {
        ...state,
        addInternalTransferLoading: false,
        addInternalTransferClearingCounter: state.addInternalTransferClearingCounter + 1,
        addInternalTransferFail: false,
        addInternalTransferSuccess: false,
        modalClear: true
      };
      break;
    case ADD_INTERNAL_TRANSFER_ERROR_CLEAR:
      state = {
        ...state,
        addInternalTransferLoading: false,
        addInternalTransferFail: false,
        addInternalTransferFailDetails: null
      };
      break;
    case APPROVE_INTERNAL_TRANSFER: 
      state = {
        ...state,
      };
      break;
    case APPROVE_INTERNAL_TRANSFER_SUCCESS: 
      state = {
        ...state,
        internalTransfers: state.internalTransfers.map(d => {
          if (d._id === action.payload){
            d.status = "APPROVED";
          }
          return d;
        }),
      };
      break;
    case REJECT_INTERNAL_TRANSFER: 
      state = {
        ...state,
      };
      break;
    case REJECT_INTERNAL_TRANSFER_SUCCESS: 
      state = {
        ...state,
        internalTransfers: state.internalTransfers.map(d => {
          if (d._id === action.payload){
            d.status = "REJECTED";
          }
          return d;
        }),
      };
      break;
    default:
      state = { ...state };
  }
  return state;
};

export default internalTransferReducer;