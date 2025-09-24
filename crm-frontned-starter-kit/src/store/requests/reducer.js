
import {
  FETCH_IB_REQUESTS_START,
  FETCH_IB_REQUESTS_SUCCESS,
  FETCH_IB_REQUESTS_ERROR,
  IB_REQUEST_STATUS_CHANGE_TO_APPROVE_SUCCESS,
  IB_REQUEST_APPROVE_START,
  IB_REQUEST_STATUS_CHANGE_TO_REJECT_SUCCESS,
  IB_REQUEST_REJECT_START,
  FETCH_LEVERAGE_REQUESTS_START,
  FETCH_LEVERAGE_REQUESTS_SUCCESS,
  FETCH_LEVERAGE_REQUESTS_ERROR,
  LEVERAGE_REQUEST_APPROVE_START,
  LEVERAGE_REQUEST_STATUS_CHANGE_TO_APPROVE_SUCCESS,
  LEVERAGE_REQUEST_REJECT_START,
  LEVERAGE_REQUEST_STATUS_CHANGE_TO_REJECT_SUCCESS,
  FETCH_ACCOUNT_REQUESTS_START,
  FETCH_ACCOUNT_REQUESTS_SUCCESS,
  FETCH_ACCOUNT_REQUESTS_ERROR,
  ACCOUNT_REQUEST_APPROVE_START,
  ACCOUNT_REQUEST_STATUS_CHANGE_TO_APPROVE_SUCCESS,
  ACCOUNT_REQUEST_REJECT_START,
  ACCOUNT_REQUEST_STATUS_CHANGE_TO_REJECT_SUCCESS,
  CLEAN_UP_REQUESTS,
  IB_REQUEST_STATUS_CHANGE_TO_APPROVE_ERROR,
  IB_REQUEST_STATUS_CHANGE_TO_REJECT_ERROR,
  LEVERAGE_REQUEST_STATUS_CHANGE_TO_APPROVE_ERROR,
  LEVERAGE_REQUEST_STATUS_CHANGE_TO_REJECT_ERROR,
  ACCOUNT_REQUEST_STATUS_CHANGE_TO_APPROVE_ERROR,
  ACCOUNT_REQUEST_STATUS_CHANGE_TO_REJECT_ERROR
} from "./actionTypes";

const initialState = {
  loading: false,
  error: "",
  ibs: [],
  leverages:[],
  clearingCounter: 0,
  editClearingCounter: 0,
  deleteClearingCounter: 0,
  isApproveOrReject: false,
  // totalDocs: 0,
  docs: [],
  // page: 1
};
const requestsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_IB_REQUESTS_START:
      state = {
        ...state,
        loading: true,
      };
      break;
    case FETCH_IB_REQUESTS_SUCCESS:
      state = {
        ...state,
        docs: [...action.payload.docs],
        totalDocs: action.payload.totalDocs,
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
        limit: action.payload.limit,
        nextPage: action.payload.nextPage,
        page: action.payload.page,
        pagingCounter: action.payload.pagingCounter,
        prevPage: action.payload.prevPage,
        totalPages: action.payload.totalPages,
        loading: false,
      };
      break;
    case FETCH_IB_REQUESTS_ERROR:
      state = {
        ...state,
        loading: false,
        error: action.payload.error
      };
      break;
    case IB_REQUEST_APPROVE_START:
      state = {
        ...state,
        loading: true
      };
      break;

    case IB_REQUEST_STATUS_CHANGE_TO_APPROVE_SUCCESS:
      // eslint-disable-next-line no-case-declarations
      state = {
        ...state,
        loading: false,
        clearingCounter: state.clearingCounter + 1,
        changeStatusLoading: false,
        isApproveOrReject: true,
      };
      break;
    case IB_REQUEST_STATUS_CHANGE_TO_APPROVE_ERROR:
      state = {
        ...state,
        loading: false,
        changeStatusLoading: false,
        isApproveOrReject: false,
      };
      break;
    case IB_REQUEST_REJECT_START:
      state = {
        ...state,
        loading: true
      };
      break;
    case IB_REQUEST_STATUS_CHANGE_TO_REJECT_SUCCESS:
      // eslint-disable-next-line no-case-declarations
      state = {
        ...state,
        clearingCounter: state.clearingCounter + 1,
        loading: false,
        changeStatusLoading: false,
        isApproveOrReject: true,
      };
      break;
    case IB_REQUEST_STATUS_CHANGE_TO_REJECT_ERROR:
      state = {
        ...state,
        loading: false,
        changeStatusLoading: false,
        isApproveOrReject: false,
      };
      break;
    // LEVERAGE REDUCERS
    case FETCH_LEVERAGE_REQUESTS_START:
      state = {
        ...state,
        loading: true,
      };
      break;
    case FETCH_LEVERAGE_REQUESTS_SUCCESS:
      state = {
        ...state,
        docs: [...action.payload.docs],
        totalDocs: action.payload.totalDocs,
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
        limit: action.payload.limit,
        nextPage: action.payload.nextPage,
        page: action.payload.page,
        pagingCounter: action.payload.pagingCounter,
        prevPage: action.payload.prevPage,
        totalPages: action.payload.totalPages,
        loading: false,
      };
      break;
    case FETCH_LEVERAGE_REQUESTS_ERROR:
      state = {
        ...state,
        loading: false,
        error: action.payload.error
      };
      break;
    case LEVERAGE_REQUEST_APPROVE_START:
      state = {
        ...state,
        loading: true
      };
      break;
    case LEVERAGE_REQUEST_STATUS_CHANGE_TO_APPROVE_SUCCESS:
      // eslint-disable-next-line no-case-declarations
      state = {
        ...state,
        loading: false,
        clearingCounter: state.clearingCounter + 1,
        changeStatusLoading: false,
        isApproveOrReject: true,
      };
      break;
    case LEVERAGE_REQUEST_STATUS_CHANGE_TO_APPROVE_ERROR:
      state = {
        ...state,
        loading: false,
        changeStatusLoading: false,
        isApproveOrReject: false,
      };
      break;
    case LEVERAGE_REQUEST_REJECT_START:
      state = {
        ...state,
        loading: true
      };
      break;
    case LEVERAGE_REQUEST_STATUS_CHANGE_TO_REJECT_SUCCESS:
      // eslint-disable-next-line no-case-declarations
      state = {
        ...state,
        loading: false,
        clearingCounter: state.clearingCounter + 1,
        changeStatusLoading: false,
        isApproveOrReject: true,
      };
      break;
    case LEVERAGE_REQUEST_STATUS_CHANGE_TO_REJECT_ERROR:
      state = {
        ...state,
        loading: false,
        changeStatusLoading: false,
        isApproveOrReject: false,
      };
      break;
    // FETCH ACCOUNT REQUESTS
    case FETCH_ACCOUNT_REQUESTS_START:
      state = {
        ...state,
        loading: true,
      };
      break;
    case FETCH_ACCOUNT_REQUESTS_SUCCESS:
      state = {
        ...state,
        docs: [...action.payload.docs],
        totalDocs: action.payload.totalDocs,
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
        limit: action.payload.limit,
        nextPage: action.payload.nextPage,
        page: action.payload.page,
        pagingCounter: action.payload.pagingCounter,
        prevPage: action.payload.prevPage,
        totalPages: action.payload.totalPages,
        loading: false,
      };
      break;
    case FETCH_ACCOUNT_REQUESTS_ERROR:
      state = {
        ...state,
        loading: false,
        error: action.payload.error
      };
      break;
    case ACCOUNT_REQUEST_APPROVE_START:
      state = {
        ...state,
        loading: true
      };
      break;

    case ACCOUNT_REQUEST_STATUS_CHANGE_TO_APPROVE_SUCCESS:
      // eslint-disable-next-line no-case-declarations
      state = {
        ...state,
        loading: false,
        changeStatusLoading: false,
        isApproveOrReject: true,
        clearingCounter: state.clearingCounter + 1,
      };
      break;
    case ACCOUNT_REQUEST_STATUS_CHANGE_TO_APPROVE_ERROR:
      state = {
        ...state,
        loading: false,
        changeStatusLoading: false,
        isApproveOrReject: false,
      };
      break;
    case ACCOUNT_REQUEST_REJECT_START:
      state = {
        ...state,
        loading: true
      };
      break;
    case ACCOUNT_REQUEST_STATUS_CHANGE_TO_REJECT_SUCCESS:
      // eslint-disable-next-line no-case-declarations
      state = {
        ...state,
        loading: false,
        changeStatusLoading: false,
        isApproveOrReject: true,
        clearingCounter: state.clearingCounter + 1,
      };
      break;
    case ACCOUNT_REQUEST_STATUS_CHANGE_TO_REJECT_ERROR:
      state = {
        ...state,
        loading: false,
        changeStatusLoading: false,
        isApproveOrReject: false,
      };
      break;
    case CLEAN_UP_REQUESTS:
      state = initialState;
      break;
    default:
      state = { ...state };
  }
  return state;
};
export default requestsReducer;