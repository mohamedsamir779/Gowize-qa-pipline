import {
  FETCH_CLIENT_DEPOSITS_REQUESTED,
  FETCH_CLIENT_DEPOSITS_SUCCESS,
  FETCH_CLIENT_DEPOSITS_FAIL,
} from "./actionTypes";
const initalState = {
  deposits:[],
  loading:false,
  error:"",
  modalClear:false,
  depositResponseMessage:""
};
const depositReducer = (state = { initalState }, action)=>{
  switch (action.type){
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
        deposits: [...action.payload.result.docs],
        totalDocs: action.payload.result.totalDocs,
        loading: false, 
        error: false
      };
      break;
    case FETCH_CLIENT_DEPOSITS_FAIL:
      state = {
        ...state,
        error: true,
        success: false,
        errorDetails: action.payload.error,
        loading: false
      };
      break;
  
    default:
      state = { ...state };
  
  }
  return state;
};
export default depositReducer;