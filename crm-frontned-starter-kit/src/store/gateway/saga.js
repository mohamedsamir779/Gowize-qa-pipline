import { 
  call, put, takeEvery
} from "redux-saga/effects";
import { getGatewayOfDeposit, getGatewaysOfWithdraw } from "apis/gateway";
import { FETCH_GATEWAYS_START, FETCH_WITHDRAWALS_GATEWAYS_START } from "./actionTypes";
import { fetchGatewaysSuccess, fetchGatewaysOfWithdrawalsSuccess } from "./action";
function * fetchGatewaysOfWithdrawals(params = {}){
  try {
    const gateways = yield call(getGatewaysOfWithdraw, params);
    yield put(fetchGatewaysOfWithdrawalsSuccess(gateways));
  } catch (error ){
    
  }
  

}
function * fetchGateways(params = {}){
  try {
    const gateways = yield call(getGatewayOfDeposit, params);
    yield put(fetchGatewaysSuccess(gateways));
  } catch (error){
     
  }
  
}

function * gatewaySaga(){
  yield takeEvery(FETCH_WITHDRAWALS_GATEWAYS_START, fetchGatewaysOfWithdrawals);
  yield takeEvery(FETCH_GATEWAYS_START, fetchGateways);
}
export default gatewaySaga;