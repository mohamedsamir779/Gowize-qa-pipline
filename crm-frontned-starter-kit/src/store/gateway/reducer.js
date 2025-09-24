const initState = {
  gateways:{},
  loading:false,
  error:""
};

const gatewayReducer = (state = initState, action)=>{
  switch (action.type){
    case "FETCH_GATEWAYS_START":
      state = {
        ...state,
        loading:true
      };
      break;
    case "FETCH_GATEWAYS_SUCCESS":
      
      state = {
        ...state,
        loading:false,
        gateways:{ ...action.payload.result }
      };
      
      break;
    case "FETCH_WITHDRAWALS_GATEWAYS_START":
      state = {
        ...state,
        loading:true
      };
      break;
    case "FETCH_WITHDRAWALS_GATEWAYS_SUCCESS":
      
      state = {
        ...state,
        loading:false,
        gateways:{ ...action.payload.result }
      };
      
      break;
    default:
      state = { ...state };
  }
  return state;
};
export default gatewayReducer;