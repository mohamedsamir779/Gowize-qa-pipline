import {
  FETCH_CONVERTS_REQUESTED,
  FETCH_CONVERTS_SUCCESS,
  FETCH_CONVERTS_FAIL,

  ADD_CONVERT_REQUESTED,
  ADD_CONVERT_SUCCESS,
  ADD_CONVERT_FAIL,
  ADD_CONVERT_CLEAR,
  ADD_CONVERT_ERROR_CLEAR
} from "./actionTypes";

const initalState = {
  converts:[],
  fetchLoading:false,
  error:"",
  addLoading: false,
};

const convertReducer = (state = initalState, action) => {
  switch (action.type){
    // fetch converts
    case FETCH_CONVERTS_REQUESTED:
      state = {
        ...state,
        fetchLoading: true
      };
      break;
    case FETCH_CONVERTS_SUCCESS:
      state = {
        ...state,
        converts: action.payload.result.docs,
        convertsTotalDocs: action.payload.result.totalDocs,
        hasNextPage: action.payload.result.hasNextPage,
        hasPrevPage: action.payload.result.hasPrevPage,
        limit: action.payload.result.limit,
        nextPage: action.payload.result.nextPage,
        page: action.payload.result.page,
        pagingCounter: action.payload.result.pagingCounter,
        prevPage: action.payload.result.prevPage,
        totalPages: action.payload.result.totalPages,
        fetchLoading: false,  
        fetchConvertsFail: false
      };
      break;
    case FETCH_CONVERTS_FAIL:
      state = {
        ...state,
        fetchLoading: false,
        errorMessage: action.payload,
        fetchConvertsFail: true
      };
      break;

    // add convert
    case ADD_CONVERT_REQUESTED:
      state = {
        ...state,
        addLoading: true,
      };
      break;
    case ADD_CONVERT_SUCCESS:
      state = {
        ...state,
        addLoading: false,
        addSuccess: true,
        addFail: false,
        newConvert: action.payload.result,
        modalClear: true
      };
      break;
    case ADD_CONVERT_FAIL:
      state = {
        ...state,
        addLoading: false,
        addSuccess: false,
        addFail: true,
        addFailDetails: action.payload.error
      };
      break;
    case ADD_CONVERT_CLEAR:
      state = {
        ...state,
        addSuccess: false,
        addFail: false
      };
      break;
    case ADD_CONVERT_ERROR_CLEAR:
      state = {
        ...state,
        addFail: false,
        addFailDetails: null
      };
      break;

    default:
      state = { ...state };
  }
  return state;
};

export default convertReducer;