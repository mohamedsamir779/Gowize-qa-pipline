import {
  GET_ACCOUNTS_START,
  GET_ACCOUNTS_SUCCESS,
  CREATE_ACCOUNT_START,
  CREATE_ACCOUNT_SUCCESS,
  CREATE_ACCOUNT_FAIL,
  GET_ACCOUNT_TYPES_START,
  GET_ACCOUNT_TYPES_SUCCESS,
  UPDATE_LEVERAGE_START,
  UPDATE_LEVERAGE_SUCCESS,
  UPDATE_LEVERAGE_FAIL,
  UPDATE_PASSWORD_START,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_FAIL,
  GET_OPEN_POSITIONS_START,
  GET_OPEN_POSITIONS_SUCCESS,
  CLEAR_ACCOUNTS_STATE,
  GET_CLOSE_POSITIONS_START,
  GET_CLOSE_POSITIONS_SUCCESS,
  GET_TRANSFERS_START,
  GET_TRANSFERS_SUCCESS,
  CREATE_INTERNAL_TRANSFER_START,
  CREATE_INTERNAL_TRANSFER_SUCCESS,
  CREATE_INTERNAL_TRANSFER_FAIL,
  CREATE_ACCOUNT_REQUEST_START,
  CREATE_ACCOUNT_REQUEST_FAIL,
  CREATE_ACCOUNT_REQUEST_SUCCESS,
}
  from "./actionTypes";

const initialState = {
  loading: false,
  submitting: false,
  error: "",
  accounts: null,
  accountTypes: [],
  positions: {
    open: null,
    closed: null,
    loading: false,
  },
  transfers: {
    loading: false,
  },
  internalTransfer: {
    loading: false,
  }
};

const accountReducer = (state = initialState, action) => {
  switch (action.type) {
    case CLEAR_ACCOUNTS_STATE:
      return {
        ...state,
        accounts: null,
        positions: {
          open: null,
          closed: null,
        }
      };
    case GET_ACCOUNTS_START:
      return {
        ...state,
        error: "",
        loading: true
      };
    case GET_ACCOUNTS_SUCCESS:
      return {
        ...state,
        loading: false,
        accounts: [...action.payload.docs],
        accountsPagination: {
          hasNextPage: action.payload.hasNextPage,
          nextPage: action.payload.nextPage,
          limit: action.payload.limit,
          totalDocs: action.payload.totalDocs,
          totalPages: action.payload.totalPages,
          page: action.payload.page,
          pagingCounter: action.payload.pagingCounter,
          hasPrevPage: action.payload.hasPrevPage,
          prevPage: action.payload.prevPage,
        }
      };
    case CREATE_ACCOUNT_REQUEST_START:
    case CREATE_ACCOUNT_START:
      return {
        ...state,
        error: "",
        submitting: true,
      };
    case CREATE_ACCOUNT_SUCCESS:
      const accounts = state.accounts ? [action.payload.result, ...state.accounts] : [action.payload.result];
      return {
        ...state,
        accounts,
        error: "",
        submitting: false,
      };
    case CREATE_ACCOUNT_REQUEST_FAIL:
    case CREATE_ACCOUNT_FAIL:
      return {
        ...state,
        submitting: false,
        error: action.payload
      };
    case CREATE_ACCOUNT_REQUEST_SUCCESS:
      return {
        ...state,
        submitting: false,
      };
    case GET_ACCOUNT_TYPES_START:
      return {
        ...state,
        error: "",
      };
    case GET_ACCOUNT_TYPES_SUCCESS:
      return {
        ...state,
        accountTypes: action.payload,
      };
    case UPDATE_LEVERAGE_START:
    case UPDATE_PASSWORD_START:
      return {
        ...state,
        error: "",
        submitting: true,
      };
    case UPDATE_LEVERAGE_SUCCESS:
    case UPDATE_PASSWORD_SUCCESS:
      return {
        ...state,
        error: "",
        submitting: false,
      };
    case UPDATE_LEVERAGE_FAIL:
    case UPDATE_PASSWORD_FAIL:
      return {
        ...state,
        error: action.payload
      };
    case GET_TRANSFERS_START:
      return {
        ...state,
        transfers: {
          loading: true,
        }
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
          closed: action.payload.docs
        }
      };
    case GET_TRANSFERS_SUCCESS:
      return {
        ...state,
        transfers: {
          ...action.payload,
          loading: false,
        }
      };
    case CREATE_INTERNAL_TRANSFER_START: 
      return {
        ...state,
        internalTransfer: {
          loading: true,
        }
      };
    case CREATE_INTERNAL_TRANSFER_SUCCESS: 
      return {
        ...state,
        internalTransfer: {
          loading: false,
        }
      };
    case CREATE_INTERNAL_TRANSFER_FAIL: 
      return {
        ...state,
        internalTransfer: {
          loading: false,
        }
      };

    default:
      return state = { ...state };
  }
};
export default accountReducer;