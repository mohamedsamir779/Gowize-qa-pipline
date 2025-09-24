import {
  FETCH_CLIENT_DEPOSITS_REQUESTED,
  FETCH_CLIENT_DEPOSITS_SUCCESS,
  FETCH_CLIENT_DEPOSITS_FAIL,
  ERROR_CLEAR,
  DEPOSIT_STATUS_CHANGE_FAIL,
  APPROVE_FOREX_DEPOSIT,
  APPROVE_FOREX_DEPOSIT_SUCCESS
} from "./actionTypes";
const initalState = {
  deposits:[],
  forexDeposits:[],
  loading:false,
  error:"",
  modalClear:false,
  depositResponseMessage:"",
  depositChangeStatusSuccess: false,
  depostiChangeStatusFail: false
};
const depositReducer = (state = { initalState }, action)=>{
  switch (action.type){
    case "FETCH_DEPOSITS_START":
      state = {
        ...state,
        loading:true,
        error:""
      };
      break;
    case "FETCH_DEPOSITS_SUCCESS":
      state = {
        deposits: [...action.payload.result.docs],
        totalDocs: action.payload.result.totalDocs,
        hasNextPage: action.payload.result.hasNextPage,
        hasPrevPage: action.payload.result.hasPrevPage,
        limit: action.payload.result.limit,
        nextPage: action.payload.result.nextPage,
        page: action.payload.result.page,
        pagingCounter: action.payload.result.pagingCounter,
        prevPage: action.payload.result.prevPage,
        totalPages: action.payload.result.totalPages,
        loading: false,       
      };
      break;
    case "ADD_DEPOSIT_START":
      state = {
        ...state,
        disableAddButton: true,
        modalClear:false,
        depositResponseMessage:"",
        addLoading: true
      };
      break;
    case "ADD_DEPOSIT_SUCCESS":
      state = {
        ...state,
        // deposits:[{ ...action.payload.deposit }, ...state.deposits],
        // totalDocs:state.totalDocs + 1,
        depositResponseMessage:action.payload.deposit.status, 
        addLoading: false
      };
      break;
    case "DEPOSIT_STATUS_CHANGE_SUCCESS":
      // eslint-disable-next-line no-case-declarations
      // const { _id } = action.payload;
      state  = {
        ...state,
        // deposits:state.deposits.map(deposit=>{
        //   if (deposit._id === _id){
        //     return {
  
        //       ...deposit,
        //       status:action.payload.status
        //     };
        //   }
        //   else {
        //     return deposit;
        //   } 
        // })
        depositChangeStatusSuccess: true,
        depositChangeStatusFail: false
      };
      break;
    case DEPOSIT_STATUS_CHANGE_FAIL:
      state = {
        ...state,
        depositChangeStatusFail: true
      };
      break;
    case "DEPOSIT_ERROR": 
      state = {
        ...state,
        disableAddButton:false,
        depositError:action.payload.error,
        addLoading: false
      };
      break;
    case "MODAL_CLEAR":
      state = {
        ...state,
        modalClear:true,
        depositResponseMessage:"",
        disableAddButton:false
      };
      break;

    // fetch client deposits 
    case FETCH_CLIENT_DEPOSITS_REQUESTED:
      state = {
        ...state,
        loading: true
      };
      break;
    case FETCH_CLIENT_DEPOSITS_SUCCESS:
      state = {
        ...state, 
        clientDeposits: action.payload.deposits.result.docs,
        depositsTotalDocs: action.payload.deposits.result.totalDocs,
        error: false,
        success: true,
        loading: false
      };
      break;
    case FETCH_CLIENT_DEPOSITS_FAIL:
      state = {
        ...state,
        error: true,
        success: false,
        errorDetails: action.payload.error
      };
      break;
    case ERROR_CLEAR:
      state = {
        ...state,
        depositError: ""
      };
      break;
    default:
      state = { ...state };

  }
  return state;
};
export default depositReducer;