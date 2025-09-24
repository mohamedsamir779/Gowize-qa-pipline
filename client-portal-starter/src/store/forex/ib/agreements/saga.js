import {
  takeEvery,
  call,
  put,
} from "redux-saga/effects";
import { showErrorNotification } from "store/general/notifications/actions";
import {
  fetchIbAgreements, getReferrals,
  getStatement, getStatementDeals
} from "apis/forex/ib";
import {
  FETCH_IB_AGREEMENTS_START, FETCH_REFERRALS_START,
  FETCH_STATEMENT_START, FETCH_STATEMENT_DEALS_START,
} from "./actionTypes";
import {
  fetchAgreementsSuccess, fetchReferralsSuccess,
  fetchStatementSuccess, fetchStatementDealsSuccess,
} from "./actions";

function* getIbAgreements() {
  try {
    const { result } = yield call(fetchIbAgreements);
    yield put(fetchAgreementsSuccess(result));
  } catch (error) {
    yield put(showErrorNotification(error));
  }
}

function * fetchReferrals(params) {
  try {
    const { result: referrals } = yield call(getReferrals, params);
    yield put(fetchReferralsSuccess(referrals));
  } catch (error){
    yield put(showErrorNotification(error));
  }  
}

function * fetchStatement(params) {
  try {
    const { result: statement } = yield call(getStatement, params);
    yield put(fetchStatementSuccess(statement));
  } catch (error){
    yield put(showErrorNotification(error?.message || error));
  }
}

function * fetchStatementDeals(params) {
  try {
    const { result: deals } = yield call(getStatementDeals, params);
    yield put(fetchStatementDealsSuccess(deals)); 
  } catch (error){
    yield put(showErrorNotification(error));

  }
}

function* agreementSaga() {
  yield takeEvery(FETCH_IB_AGREEMENTS_START, getIbAgreements);
  yield takeEvery(FETCH_REFERRALS_START, fetchReferrals);
  yield takeEvery(FETCH_STATEMENT_START, fetchStatement);
  yield takeEvery(FETCH_STATEMENT_DEALS_START, fetchStatementDeals);

}

export default agreementSaga;