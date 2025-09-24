import {
  FETCH_WALLET_REPORT_FAILED,
  FETCH_WALLET_REPORT_START,
  FETCH_WALLET_REPORT_SUCCESS,
  FETCH_WALLETS_FAILED,
  FETCH_WALLETS_START,
  FETCH_WALLETS_SUCCESS,
  IB_WALLET_TRANSFER_FAILED,
  IB_WALLET_TRANSFER_START,
  IB_WALLET_TRANSFER_SUCCESS,
  REQUEST_WALLET_FX_TRANSFER_ERROR,
  REQUEST_WALLET_FX_TRANSFER_START,
  REQUEST_WALLET_FX_TRANSFER_SUCCESS,
} from "./actionTypes";

const initialState = {
  loading: false,
  wallets: [],
  transferLoading: false,
  clearingCounter: 0,
  report: {
    loading: false,
    data: [],
    pagination: {},
  }
};

const Wallets = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_WALLETS_START:
      state = {
        ...state,
        loading: true 
      };
      break;
    case FETCH_WALLETS_FAILED:
      state = {
        ...state,
        loading: false,
        error: action.payload 
      };
      break;
        
    case FETCH_WALLETS_SUCCESS:

      state = {
        ...state,
        loading: false,
        error: "",
        wallets: action.payload 
      };
      break;

    case REQUEST_WALLET_FX_TRANSFER_START:
    case IB_WALLET_TRANSFER_START:
      state = {
        ...state,
        transferLoading: true,
      };
      break;
    case REQUEST_WALLET_FX_TRANSFER_SUCCESS:
    case IB_WALLET_TRANSFER_SUCCESS:
      state = {
        ...state,
        transferLoading: false,
        clearingCounter: state.clearingCounter + 1,
      };
      break;
    case REQUEST_WALLET_FX_TRANSFER_ERROR:
    case IB_WALLET_TRANSFER_FAILED:
      state = {
        ...state,
        transferLoading: false,
      };
      break;
    case FETCH_WALLET_REPORT_START:
      state = {
        ...state,
        report: {
          ...state.report,
          loading: true,
        },
      };
      break;
    case FETCH_WALLET_REPORT_SUCCESS:
      state = {
        ...state,
        report: {
          ...state.report,
          loading: false,
          data: action.payload.docs,
          pagination: {
            ...action.payload,
          }
        },
      };
      delete state.report.pagination.docs;
      break;
    case FETCH_WALLET_REPORT_FAILED:
      state = {
        ...state,
        report: {
          ...state.report,
          loading: false,
        },
      };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default Wallets;
