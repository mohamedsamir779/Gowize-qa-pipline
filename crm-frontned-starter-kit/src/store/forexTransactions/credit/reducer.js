import {
  FETCH_CREDITS_REQUESTED,
  FETCH_CREDITS_SUCCESS,
  FETCH_CREDITS_FAIL,

  ADD_CREDIT_REQUESTED,
  ADD_CREDIT_SUCCESS,
  ADD_CREDIT_FAIL,
  ADD_CREDIT_CLEAR,
  ADD_CREDIT_ERROR_CLEAR
} from "./actionTypes";

const initalState = {
  credits: [],
  fetchCreditsLoading: false,
  addCreditLoading: false,
  error: "",
  modalClear: false,
  creditResponseMessage: "",
  addCreditClearingCounter: 0
};

const creditReducer = (state = initalState, action) => {
  switch (action.type){
    // fetch credits
    case FETCH_CREDITS_REQUESTED:
      state = {
        ...state,
        fetchCreditsLoading: true
      };
      break;
    case FETCH_CREDITS_SUCCESS:
      state = {
        ...state,
        credits: [...action.payload.result.docs],
        creditsTotalDocs: action.payload.result.totalDocs,
        hasNextPage: action.payload.result.hasNextPage,
        hasPrevPage: action.payload.result.hasPrevPage,
        limit: action.payload.result.limit,
        nextPage: action.payload.result.nextPage,
        page: action.payload.result.page,
        pagingCounter: action.payload.result.pagingCounter,
        prevPage: action.payload.result.prevPage,
        totalPages: action.payload.result.totalPages,
        fetchCreditsLoading: false,  
      };
      break;
    case FETCH_CREDITS_FAIL:
      state = {
        ...state,
        fetchCreditsLoading: false,
        creditsError: action.payload
      };
      break;

    // add credit
    case ADD_CREDIT_REQUESTED:
      state = {
        ...state,
        addCreditLoading: true
      };
      break;
    case ADD_CREDIT_SUCCESS:
      state = {
        ...state,
        newCredit: action.payload.result,
        addCreditSuccess: true,
        addCreditFail: false
      };
      break;
    case ADD_CREDIT_FAIL:
      state = {
        ...state,
        addCreditSuccess: false,
        addCreditFail: true,
        addCreditLoading: false,
        addCreditFailDetails: action.payload.error
      };
      break;
    case ADD_CREDIT_CLEAR:
      state = {
        ...state,
        addCreditLoading: false,
        addCreditClearingCounter: state.addCreditClearingCounter + 1,
        addCreditFail: false,
        addCreditSuccess: false,
        modalClear: true
      };
      break;
    case ADD_CREDIT_ERROR_CLEAR:
      state = {
        ...state,
        addCreditLoading: false,
        addCreditFail: false,
        addCreditFailDetails: null
      };
      break;
      
    default:
      state = { ...state };
  }
  return state;
};

export default creditReducer;