import {
  FETCH_WALLET_TRANSFER_START,
  FETCH_WALLET_TRANSFER_SUCCESS,
  FETCH_WALLET_TRANSFER_ERROR,
  APPROVE_WALLET_TRANSFER_START,
  APPROVE_WALLET_TRANSFER_SUCCESS,
  APPROVE_WALLET_TRANSFER_ERROR,
  REJECT_WALLET_TRANSFER_START,
  REJECT_WALLET_TRANSFER_SUCCESS,
  REJECT_WALLET_TRANSFER_ERROR,
} from "./actionTypes";

const initialState = {
  loading: false,
  submitLoading: false,
  requests: [],
  clearingCounter: 0,
  requestsPagination: {},
};
const transferReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_WALLET_TRANSFER_START:
      state = {
        ...state,
        loading: true,
      };
      break;
    case FETCH_WALLET_TRANSFER_SUCCESS:
      state = {
        ...state,
        loading: false,
        requests: action.payload.docs,
        requestsPagination: {
          ...action.payload
        }
      };
      break;
    case FETCH_WALLET_TRANSFER_ERROR:
      state = {
        ...state,
        loading: false,
      };
      break;
    case APPROVE_WALLET_TRANSFER_START:
      state = {
        ...state,
        submitLoading: true,
      };
      break;
    case APPROVE_WALLET_TRANSFER_SUCCESS:
      state = {
        ...state,
        submitLoading: false,
        clearingCounter: state.clearingCounter + 1,
      };
      break;
    case APPROVE_WALLET_TRANSFER_ERROR:
      state = {
        ...state,
        submitLoading: false,
      };
      break;
    case REJECT_WALLET_TRANSFER_START:
      state = {
        ...state,
        submitLoading: true,
      };
      break;
    case REJECT_WALLET_TRANSFER_SUCCESS:
      state = {
        ...state,
        submitLoading: false,
        clearingCounter: state.clearingCounter + 1,
      };
      break;
    case REJECT_WALLET_TRANSFER_ERROR:
      state = {
        ...state,
        submitLoading: false,
      };
      break;
    default:
      state = { ...state };
  }
  return state;
};
export default transferReducer;
