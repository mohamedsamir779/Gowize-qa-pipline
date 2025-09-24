import {
  FETCH_WITHDRAWALS_GATEWAYS_START, FETCH_WITHDRAWALS_GATEWAYS_SUCCESS,
  ADD_WITHDRAWAL_REQUESTED, ADD_WITHDRAWAL_SUCCESS, ADD_WITHDRAWAL_FAIL,
  GET_IB_WITHDRAWS_START, GET_IB_WITHDRAWS_SUCCCESS,
  GET_IB_DEPOSITS_START, GET_IB_DEPOSITS_SUCCCESS,
  IB_INTERNAL_TRANSFER_START, IB_INTERNAL_TRANSFER_SUCCESS, IB_INTERNAL_TRANSFER_FAILED
} from "./actionTypes";

const initialState = {
  loading: false,
  deposits: { docs: [] },
  withdraws: { 
    docs: [],
    gateways: [],
    loading: false,
    submitting: false,
  },
  ibInternalTransfer: {}
};

const ibTransactions = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_WITHDRAWALS_GATEWAYS_START:
      return state = {
        ...state,
        withdraws: {
          ...state.withdraws,
          loading: true
        }
      };
    case FETCH_WITHDRAWALS_GATEWAYS_SUCCESS:
      return state = {
        ...state,
        withdraws: {
          ...state.withdraws,
          gateways: { ...action.payload.result },
          loading: false,
        }
      };
    case ADD_WITHDRAWAL_REQUESTED:
      return state = {
        ...state,
        withdraws: {
          ...state.withdraws,
          submitting: true,
        }
      };
    case ADD_WITHDRAWAL_SUCCESS:
      return state = {
        ...state,
        withdraws: {
          ...state.withdraws,
          docs: [...state.withdraws.docs, action.payload.result],
          submitting: false
        }
      };
    case ADD_WITHDRAWAL_FAIL:
      return state = {
        ...state,
        withdraws: {
          ...state.withdraws,
          submitting: false,
          error: action.payload.error,
        }
      };
    case GET_IB_WITHDRAWS_START:
      return {
        ...state,
        withdraws: {
          ...state.withdraws,
          loading: true
        }
      };
    case GET_IB_DEPOSITS_START:
      return {
        ...state,
        deposits: {
          ...state.deposits,
          loading: true
        }
      };
    case GET_IB_WITHDRAWS_SUCCCESS:
      return {
        ...state,
        loading: false,
        withdraws: {
          loading: false,
          ...action.payload
        }
      };
    case GET_IB_DEPOSITS_SUCCCESS:
      return {
        ...state,
        loading: false,
        deposits: {
          loading: false,
          ...action.payload
        }
      };
    case IB_INTERNAL_TRANSFER_START:
      return {
        ...state,
        ibInternalTransfer: {
          ...state.ibInternalTransfer,
          loading: true,
        }
      };
    case IB_INTERNAL_TRANSFER_SUCCESS:
      return {
        ...state,
        ibInternalTransfer: {
          ...state.ibInternalTransfer,
          loading: false,
        }
      };
    case IB_INTERNAL_TRANSFER_FAILED:
      return {
        ...state,
        ibInternalTransfer: {
          ...state.ibInternalTransfer,
          loading: false
        }
      };
    default:
      return state;
  }
};
export default ibTransactions;