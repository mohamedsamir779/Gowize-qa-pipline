import {
  FETCH_IB_AGREEMENTS_START, FETCH_IB_AGREEMENTS_SUCCESS,
  FETCH_REFERRALS_START, FETCH_REFERRALS_SUCCESS,
  FETCH_STATEMENT_START, FETCH_STATEMENT_SUCCESS,
  FETCH_STATEMENT_DEALS_START, FETCH_STATEMENT_DEALS_SUCCESS,

} from "./actionTypes";

const initalState = {
  loading: false,
  dealsLoading: false,
  agreements: [],
  referrals: [],
  statement: [],
  statementDeals: [],
};
const agreementReducer = (state = initalState, action) => {
  switch (action.type) {
    case FETCH_IB_AGREEMENTS_START:
      state = {
        ...state,
        loading: true,
        error: ""
      };
      break;
    case FETCH_IB_AGREEMENTS_SUCCESS:
      state = {
        ...state,
        agreements: action.payload,
        loading: false
      };
      break;
    case FETCH_REFERRALS_START:
      state = {
        ...state,
        loading: true,
      };
      break;
    case FETCH_REFERRALS_SUCCESS:
      state = {
        ...state,
        loading: false,
        referrals: action.payload,
      };
      break;
    case FETCH_STATEMENT_START:
      state = {
        ...state,
        loading: true,
      };
      break;
    case FETCH_STATEMENT_SUCCESS:
      state = {
        ...state,
        statement: action.payload,
        loading: false,
      };
      break;
    case FETCH_STATEMENT_DEALS_START:
      state = {
        ...state,
        dealsLoading: true,
      };
      break;
    case FETCH_STATEMENT_DEALS_SUCCESS:
      state = {
        ...state,
        statementDeals: action.payload,
        dealsLoading: false,
      };
      break;
    default:
      state = { ...state };
  }
  return state;
};
export default agreementReducer;