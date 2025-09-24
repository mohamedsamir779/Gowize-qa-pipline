import {
  FETCH_CLIENT_TRANSACTIONS_START,
  FETCH_CLIENT_TRANSACTIONS_END
} from "./actionTypes";

const initalState = {
  loading:false,
  clientTransactionsError:"",
  clientTransactions:{},
};
const depositReducer = (state = { initalState }, action)=>{
  switch (action.type){
    case FETCH_CLIENT_TRANSACTIONS_START:
      state = {
        ...state,
        loading:true,
        error:""
      };
      break;
    case FETCH_CLIENT_TRANSACTIONS_END:
      state = {
        loading: false,
        clientTransactions: action.payload.data,
        clientTransactionsError: action.payload.error,
      };
      break;
   
    default:
      state = { ...state };

  }
  return state;
};
export default depositReducer;