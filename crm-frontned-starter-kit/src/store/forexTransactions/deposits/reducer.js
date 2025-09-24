import {
  FETCH_FOREX_DEPOSITS_REQUESTED,
  FETCH_FOREX_DEPOSITS_SUCCESS,
  FETCH_FOREX_DEPOSITS_FAIL,

  ADD_FOREX_DEPOSIT_REQUESTED,
  ADD_FOREX_DEPOSIT_SUCCESS,
  ADD_FOREX_DEPOSIT_FAIL,
  ADD_FOREX_DEPOSIT_CLEAR,
  ADD_FOREX_DEPOSIT_ERROR_CLEAR,
  APPROVE_FOREX_DEPOSIT,
  APPROVE_FOREX_DEPOSIT_SUCCESS,
  REJECT_FOREX_DEPOSIT_SUCCESS
} from "./actionTypes";

const initalState = {
  forexDeposits:[],
  fetchLoading:false,
  addLoading:false,
  error:"",
  modalClear:false,
  forexDepositResponseMessage:"",
  addForexDepositClearingCounter: 0
};

const forexDepositReducer = (state = initalState, action) => {
  switch (action.type){
    // fetch forex deposits
    case FETCH_FOREX_DEPOSITS_REQUESTED:
      state = {
        ...state,
        fetchLoading: true
      };
      break;
    case FETCH_FOREX_DEPOSITS_SUCCESS:
      state = {
        ...state,
        forexDeposits: [...action.payload.result.docs],
        forexTotalDocs: action.payload.result.totalDocs,
        hasNextPage: action.payload.result.hasNextPage,
        hasPrevPage: action.payload.result.hasPrevPage,
        limit: action.payload.result.limit,
        nextPage: action.payload.result.nextPage,
        page: action.payload.result.page,
        pagingCounter: action.payload.result.pagingCounter,
        prevPage: action.payload.result.prevPage,
        totalPages: action.payload.result.totalPages,
        fetchLoading: false,  
      };
      break;
    case FETCH_FOREX_DEPOSITS_FAIL:
      state = {
        ...state,
        fetchLoading: false,
        forexDepositError: action.payload
      };
      break;

    // add forex deposit
    case ADD_FOREX_DEPOSIT_REQUESTED:
      state = {
        ...state,
        addLoading: true,
        addForexDepositSuccess: false,
        addForexDepositFail: false,
        addForexDepositFailDetails: ""
      };
      break;
    case ADD_FOREX_DEPOSIT_SUCCESS:
      state = {
        ...state,
        newForexDeposit: action.payload.result,
        addForexDepositSuccess: true,
        addForexDepositFail: false
      };
      break;
    case ADD_FOREX_DEPOSIT_FAIL:
      state = {
        ...state,
        addForexDepositSuccess: false,
        addForexDepositFail: true,
        addLoading: false,
        addForexDepositFailDetails: action.payload.error
      };
      break;
    case ADD_FOREX_DEPOSIT_CLEAR:
      state = {
        ...state,
        addLoading: false,
        addForexDepositClearingCounter: state.addForexDepositClearingCounter + 1,
        addForexDepositFail: false,
        addForexDepositSuccess: false,
        modalClear: true,
        addForexDepositFailDetails: ""
      };
      break;
    case ADD_FOREX_DEPOSIT_ERROR_CLEAR:
      state = {
        ...state,
        addForexDepositFail: false,
        addForexDepositSuccess: false,
        addForexDepositFailDetails: null
      };
      break;
    case APPROVE_FOREX_DEPOSIT:
      return {
        ...state,
      };
    case APPROVE_FOREX_DEPOSIT_SUCCESS:
      return {
        ...state,
        forexDeposits:state.forexDeposits.map(d => {
          if (d._id === action.payload){
            d.status = "APPROVED";
          }
          return d;
        }),
      };
    case REJECT_FOREX_DEPOSIT_SUCCESS:
      return {
        ...state,
        forexDeposits:state.forexDeposits.map(d => {
          if (d._id === action.payload){
            d.status = "REJECTED";
          }
          return d;
        }),
      };
    default:
      state = { ...state };
  }
  return state;
};

export default forexDepositReducer;