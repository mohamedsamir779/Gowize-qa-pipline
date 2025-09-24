import {
  FETCH_FOREX_DEPOSITS_GATEWAYS_START, 
  FETCH_FOREX_DEPOSITS_GATEWAYS_SUCCESS,
  FETCH_FOREX_WITHDRAWALS_GATEWAYS_START,
  FETCH_FOREX_WITHDRAWALS_GATEWAYS_SUCCESS
} from "./actionTypes";

const initState = {
  forexDepositsGateways: {},
  forexWithdrawalsGateways: {},
  depositsGatewaysLoading: false,
  withdrawalsGatewaysLoading: false,
  error: ""
};

const forexGatewayReducer = (state = initState, action)=>{
  switch (action.type){
    case FETCH_FOREX_DEPOSITS_GATEWAYS_START:
      state = {
        ...state,
        depositsGatewaysLoading: true
      };
      break;
    case FETCH_FOREX_DEPOSITS_GATEWAYS_SUCCESS:
      state = {
        ...state,
        depositsGatewaysLoading: false,
        forexDepositsGateways: { ...action.payload.result }
      };
      break;

    case FETCH_FOREX_WITHDRAWALS_GATEWAYS_START:
      state = {
        ...state,
        withdrawalsGatewaysLoading: true
      };
      break;
    case FETCH_FOREX_WITHDRAWALS_GATEWAYS_SUCCESS:
      state = {
        ...state,
        withdrawalsGatewaysLoading: false,
        forexWithdrawalsGateways: { ...action.payload.result }
      };
      break;

    default:
      state = { ...state };
  }
  return state;
};
export default forexGatewayReducer;