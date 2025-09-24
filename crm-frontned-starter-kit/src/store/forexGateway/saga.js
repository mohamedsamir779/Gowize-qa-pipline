import { 
  call, put, takeEvery
} from "redux-saga/effects";
import { getForexGatewayOfDeposit, getForexGatewaysOfWithdraw } from "apis/fxGateway";
import { FETCH_FOREX_DEPOSITS_GATEWAYS_START, FETCH_FOREX_WITHDRAWALS_GATEWAYS_START } from "./actionTypes";
import { fetchForexDepositsGatewaysSuccess, fetchForexWithdrawalsGatewaysSuccess } from "./actions";

function * fetchGateways(params = {}){
  try {
    const gateways = yield call(getForexGatewayOfDeposit, params);
    yield put(fetchForexDepositsGatewaysSuccess(gateways));
  } catch (error){}
}

function * fetchGatewaysOfWithdrawals(params = {}){
  try {
    const gateways = yield call(getForexGatewaysOfWithdraw, params);
    yield put(fetchForexWithdrawalsGatewaysSuccess(gateways));
  } catch (error ){}
}

function * forexGatewaySaga(){
  yield takeEvery(FETCH_FOREX_WITHDRAWALS_GATEWAYS_START, fetchGatewaysOfWithdrawals);
  yield takeEvery(FETCH_FOREX_DEPOSITS_GATEWAYS_START, fetchGateways);
}
export default forexGatewaySaga;