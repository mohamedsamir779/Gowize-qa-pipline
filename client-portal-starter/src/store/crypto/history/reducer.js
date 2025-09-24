import {
  GET_DEPOSITS_SUCCESS,
  GET_WITHDRAWALS_SUCCESS, 
  API_ERROR,
  GET_CONVERT_START,
  GET_CONVERT_SUCCESS,
  GET_DEPOSITS_START,
  GET_WITHDRAWALS_START,

  FETCH_DEPOSIT_GATEWAY_REQUESTED,
  FETCH_DEPOSIT_GATEWAY_SUCCESS,
  FETCH_DEPOSIT_GATEWAY_FAIL,

  FETCH_WITHDRAWAL_GATEWAY_REQUESTED,
  FETCH_WITHDRAWAL_GATEWAY_SUCCESS,
  FETCH_WITHDRAWAL_GATEWAY_FAIL
} from "./actionTypes";

const initalState = {
  error:"",
  loading:"",
  withdrawalLoading: false,
  depositLoading: false,
  withdrawals :[],
  deposits : [], 
  orders:[],
  depositGateWayLoading: false
};

const historyReducer = (state = initalState, action)=>{
  switch (action.type){
    case GET_DEPOSITS_START:
      state = {
        ...state,
        depositLoading: true,
      };
      break;
    case GET_DEPOSITS_SUCCESS:
      state = {
        ...state,
        depositLoading: false,
        deposits: [...action.payload.docs],
        depositsTotalDocs:action.payload.totalDocs
      };
      break;
    case GET_WITHDRAWALS_SUCCESS:
      state = {
        ...state,
        withdrawalLoading: false,
        withdrawals:[...action.payload.docs],
        withdrawalsTotalDocs : action.payload.totalDocs
      };
      break;
    case GET_WITHDRAWALS_START:
      state = {
        ...state,
        withdrawalLoading: true,
      };
      break;
    case API_ERROR:
      state = {
        ...state, 
        error:action.payload,
        depositLoading: false,
        withdrawalLoading: false,
      };
      break;
    case GET_CONVERT_START:
      state = {
        ...state,
        loading: true
      };
      break;
    case GET_CONVERT_SUCCESS:
      state = {
        ...state,
        loading: false,
        error: false,
        converts: action.payload.docs,
        totalConverts: action.payload.totalDocs
      };
      break;

    // deposit gateways
    case FETCH_DEPOSIT_GATEWAY_REQUESTED:
      state = {
        ...state,
        depositGateWayLoading: true,
      };
      break;
    case FETCH_DEPOSIT_GATEWAY_SUCCESS:
      state = {
        ...state,
        depositGateWayLoading: false,
        depositGateWaySuccess: true,
        depositGateWayError: false,
        depositGateWays: action.payload.result
      };
      break;
    case FETCH_DEPOSIT_GATEWAY_FAIL:
      state = {
        ...state,
        depositGateWayLoading: false,
        depositGateWaySuccess: false,
        depositGateWayError: true,
        depositGateWayErrorDetails: action.payload
      };
      break;

    // deposit gateways
    case FETCH_WITHDRAWAL_GATEWAY_REQUESTED:
      state = {
        ...state,
        withdrawalGateWayLoading: true,
      };
      break;
    case FETCH_WITHDRAWAL_GATEWAY_SUCCESS:
      state = {
        ...state,
        withdrawalGateWayLoading: false,
        withdrawalGateWaySuccess: true,
        withdrawalGateWayError: false,
        withdrawalGateWays: action.payload.result
      };
      break;
    case FETCH_WITHDRAWAL_GATEWAY_FAIL:
      state = {
        ...state,
        withdrawalGateWayLoading: false,
        withdrawalGateWaySuccess: false,
        withdrawalGateWayError: true,
        withdrawalGateWayErrorDetails: action.payload
      };
      break;
      
    default :
      state = { ...state };
  }
  return state;
};
export default historyReducer;