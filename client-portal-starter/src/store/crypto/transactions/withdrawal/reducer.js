import {
  FETCH_CLIENT_WITHDRAWALS_REQUESTED,
  FETCH_CLIENT_WITHDRAWALS_SUCCESS,
  FETCH_CLIENT_WITHDRAWALS_FAIL
} from "./actionTypes";
  
const initalState = {
  withdrawals:[],
  loading:false,
  error:"",
  withdrawResponseMessage:"",
  modalClear:false
};
const withdrawalReducer = (state = { initalState }, action)=>{
  switch (action.type){
    // fetch client withdrawals 
    case FETCH_CLIENT_WITHDRAWALS_REQUESTED:
      state = {
        ...state,
        loading: true
      };
      break;
    case FETCH_CLIENT_WITHDRAWALS_SUCCESS:
      state = {
        ...state,
        withdrawals: [...action.payload.result.docs],
        totalDocs: action.payload.result.totalDocs,
        loading: false, 
        error: false
      };
      break;
    case FETCH_CLIENT_WITHDRAWALS_FAIL:
      state = {
        ...state,
        withdrawals: [...action.payload.result.docs],
        totalDocs: action.payload.result.totalDocs,
        loading: false, 
        error: false
      };
      break;
    default:
      state = { ...state };
    
  }
  return state;
};
export default withdrawalReducer;